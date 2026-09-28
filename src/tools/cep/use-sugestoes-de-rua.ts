import { useEffect, useState } from 'react'

import { normalizarTexto } from '@/lib/texto'
import { consultarApi } from '@/tools/_core/cliente-api'

import { ATRASO_SUGESTOES_MS, MINIMO_TERMO } from './constantes'
import type { BuscaReversa, Endereco } from './tipos'

type ResultadoEmCache = {
  termo: string
  busca: BuscaReversa | null
  erro: string | null
}

type Falha = {
  chave: string
  mensagem: string
}

type RuaSugerida = {
  nome: string
  ceps: number
  bairros: number
}

const agruparRuas = (enderecos: Endereco[]): RuaSugerida[] => {
  const grupos = new Map<string, { ceps: number; bairros: Set<string> }>()

  for (const endereco of enderecos) {
    if (!endereco.logradouro) {
      continue
    }

    const grupo = grupos.get(endereco.logradouro) ?? {
      ceps: 0,
      bairros: new Set<string>(),
    }

    grupo.ceps += 1

    if (endereco.bairro) {
      grupo.bairros.add(endereco.bairro)
    }

    grupos.set(endereco.logradouro, grupo)
  }

  return [...grupos]
    .map(([nome, grupo]) => ({
      nome,
      ceps: grupo.ceps,
      bairros: grupo.bairros.size,
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
}

const refinarLocalmente = (
  base: BuscaReversa,
  termoNormalizado: string,
): BuscaReversa => ({
  enderecos: base.enderecos.filter(
    (endereco) =>
      !endereco.logradouro ||
      normalizarTexto(endereco.logradouro).includes(termoNormalizado),
  ),
  truncado: false,
})

const useSugestoesDeRua = (
  uf: string,
  cidade: string,
  termo: string,
  habilitado: boolean,
) => {
  const [cache, setCache] = useState<Record<string, ResultadoEmCache>>({})
  const [falha, setFalha] = useState<Falha | null>(null)

  const termoNormalizado = normalizarTexto(termo)
  const escopo = `${uf}|${normalizarTexto(cidade)}|`
  const chave = `${escopo}${termoNormalizado}`
  const ativo = habilitado && termoNormalizado.length >= MINIMO_TERMO

  const direto = ativo ? cache[chave] : undefined

  const baseCompleta =
    ativo && !direto
      ? Object.entries(cache).find(
          ([chaveEmCache, resultado]) =>
            chaveEmCache.startsWith(escopo) &&
            resultado.busca !== null &&
            !resultado.busca.truncado &&
            termoNormalizado.includes(resultado.termo),
        )?.[1]
      : undefined

  const falhaAtual = ativo && falha?.chave === chave ? falha.mensagem : null

  const resultado: ResultadoEmCache | undefined =
    direto ??
    (baseCompleta?.busca
      ? {
          termo: termoNormalizado,
          busca: refinarLocalmente(baseCompleta.busca, termoNormalizado),
          erro: null,
        }
      : undefined) ??
    (falhaAtual
      ? { termo: termoNormalizado, busca: null, erro: falhaAtual }
      : undefined)

  const precisaBuscar = ativo && !resultado

  useEffect(() => {
    if (!precisaBuscar) {
      return
    }

    const controle = new AbortController()

    const temporizador = setTimeout(async () => {
      const guardar = (busca: BuscaReversa) =>
        setCache((anterior) => ({
          ...anterior,
          [chave]: { termo: termoNormalizado, busca, erro: null },
        }))

      setFalha(null)

      const query = new URLSearchParams({ uf, cidade, rua: termo.trim() })
      const envelope = await consultarApi<BuscaReversa>(`/api/cep?${query}`, {
        signal: controle.signal,
      })

      if (controle.signal.aborted) {
        return
      }

      if (envelope.ok) {
        guardar(envelope.data)
      } else if (envelope.erro.codigo === 'nao_encontrado') {
        guardar({ enderecos: [], truncado: false })
      } else {
        setFalha({ chave, mensagem: envelope.erro.mensagem })
      }
    }, ATRASO_SUGESTOES_MS)

    return () => {
      clearTimeout(temporizador)
      controle.abort()
    }
  }, [chave, cidade, precisaBuscar, termo, termoNormalizado, uf])

  const busca = resultado?.busca ?? null
  const somenteCepGeral =
    busca !== null &&
    busca.enderecos.length > 0 &&
    busca.enderecos.every((endereco) => !endereco.logradouro)

  return {
    ativo,
    carregando: precisaBuscar,
    ruas: busca ? agruparRuas(busca.enderecos) : [],
    truncado: busca?.truncado ?? false,
    cepUnico: somenteCepGeral ? (busca.enderecos[0]?.cep ?? null) : null,
    erro: resultado?.erro ?? null,
  }
}

export { useSugestoesDeRua }
export type { RuaSugerida }
