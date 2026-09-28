import type { ZodType } from 'zod'

import { garantirLimite, LimiteExcedidoError } from './limite-de-taxa'
import { type ServicoExterno, SERVICOS_EXTERNOS } from './servicos-externos'

type ErroApi = {
  codigo: string
  mensagem: string
}

type Envelope<T> = { ok: true; data: T } | { ok: false; erro: ErroApi }

type BuscarOpts<T> = {
  servico: ServicoExterno
  revalidate: number
  schema: ZodType<T>
  timeoutMs?: number
}

const TIMEOUT_PADRAO_MS = 5_000
const NAO_INDEXAR = { 'X-Robots-Tag': 'noindex, nofollow' }

class ErroUpstream extends Error {
  readonly status: number

  constructor(status: number) {
    super(`upstream respondeu ${status}`)
    this.name = 'ErroUpstream'
    this.status = status
  }
}

const respostaOk = <T>(data: T, revalidate: number) =>
  Response.json({ ok: true, data } satisfies Envelope<T>, {
    headers: {
      'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate * 2}`,
      ...NAO_INDEXAR,
    },
  })

const respostaErro = (
  erro: ErroApi,
  status: number,
  cabecalhosExtras: Record<string, string> = {},
) =>
  Response.json({ ok: false, erro } satisfies Envelope<never>, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...NAO_INDEXAR,
      ...cabecalhosExtras,
    },
  })

const erroEntradaInvalida = (mensagem: string) =>
  respostaErro({ codigo: 'entrada_invalida', mensagem }, 400)

const erroNaoEncontrado = (mensagem: string) =>
  respostaErro({ codigo: 'nao_encontrado', mensagem }, 404)

const buscarJson = async <T>(url: string, opts: BuscarOpts<T>): Promise<T> => {
  await garantirLimite(SERVICOS_EXTERNOS[opts.servico], 'global')

  const resposta = await fetch(url, {
    cache: 'force-cache',
    next: { revalidate: opts.revalidate },
    signal: AbortSignal.timeout(opts.timeoutMs ?? TIMEOUT_PADRAO_MS),
  })

  if (!resposta.ok) {
    throw new ErroUpstream(resposta.status)
  }

  return opts.schema.parse(await resposta.json())
}

const comTratamentoDeErro = async (
  executar: () => Promise<Response>,
): Promise<Response> => {
  try {
    return await executar()
  } catch (erro) {
    if (erro instanceof LimiteExcedidoError) {
      return respostaErro(
        { codigo: 'limite_excedido', mensagem: erro.message },
        429,
        { 'Retry-After': String(erro.segundosParaLiberar) },
      )
    }

    if (erro instanceof DOMException && erro.name === 'TimeoutError') {
      return respostaErro(
        {
          codigo: 'tempo_esgotado',
          mensagem: 'O serviço consultado demorou demais para responder.',
        },
        504,
      )
    }

    return respostaErro(
      {
        codigo: 'servico_indisponivel',
        mensagem: 'Não foi possível consultar o serviço no momento.',
      },
      502,
    )
  }
}

export {
  buscarJson,
  comTratamentoDeErro,
  erroEntradaInvalida,
  erroNaoEncontrado,
  ErroUpstream,
  respostaOk,
}
export type { Envelope, ErroApi }
