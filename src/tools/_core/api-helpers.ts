import type { ZodType } from 'zod'

type ErroApi = {
  codigo: string
  mensagem: string
}

type Envelope<T> = { ok: true; data: T } | { ok: false; erro: ErroApi }

type BuscarOpts<T> = {
  revalidate: number
  schema: ZodType<T>
  timeoutMs?: number
}

const TIMEOUT_PADRAO_MS = 5_000

const respostaOk = <T>(data: T, revalidate: number) =>
  Response.json({ ok: true, data } satisfies Envelope<T>, {
    headers: {
      'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate * 2}`,
    },
  })

const respostaErro = (erro: ErroApi, status: number) =>
  Response.json({ ok: false, erro } satisfies Envelope<never>, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })

const erroEntradaInvalida = (mensagem: string) =>
  respostaErro({ codigo: 'entrada_invalida', mensagem }, 400)

const erroNaoEncontrado = (mensagem: string) =>
  respostaErro({ codigo: 'nao_encontrado', mensagem }, 404)

const buscarJson = async <T>(url: string, opts: BuscarOpts<T>): Promise<T> => {
  const resposta = await fetch(url, {
    cache: 'force-cache',
    next: { revalidate: opts.revalidate },
    signal: AbortSignal.timeout(opts.timeoutMs ?? TIMEOUT_PADRAO_MS),
  })

  if (!resposta.ok) {
    throw new Error(`upstream respondeu ${resposta.status}`)
  }

  return opts.schema.parse(await resposta.json())
}

const comTratamentoDeErro = async (
  executar: () => Promise<Response>,
): Promise<Response> => {
  try {
    return await executar()
  } catch (erro) {
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
  respostaOk,
}
export type { Envelope, ErroApi }
