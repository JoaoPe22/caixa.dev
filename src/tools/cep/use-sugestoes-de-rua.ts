import { useEffect, useState } from 'react'

import { normalizarTexto } from '@/lib/texto'
import type { Envelope } from '@/tools/_core/api-helpers'

import { ATRASO_SUGESTOES_MS, MINIMO_TERMO } from './constantes'
import type { BuscaReversa, Endereco } from './consultar-cep'

type ResultadoEmCache = {
  termo: string
  busca: BuscaReversa | null
  erro: string | null
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

  const resultado: ResultadoEmCache | undefined =
    direto ??
    (baseCompleta?.busca
      ? {
          termo: termoNormalizado,
          busca: refinarLocalmente(baseCompleta.busca, termoNormalizado),
          erro: null,
        }
      : undefined)

  const precisaBuscar = ativo && !resultado

  useEffect(() => {
    if (!precisaBuscar) {
      return
    }

    const controle = new AbortController()

    const temporizador = setTimeout(async () => {
      const guardar = (entrada: Omit<ResultadoEmCache, 'termo'>) =>
        setCache((anterior) => ({
          ...anterior,
          [chave]: { termo: termoNormalizado, ...entrada },
        }))

      try {
        const query = new URLSearchParams({ uf, cidade, rua: termo.trim() })
        const resposta = await fetch(`/api/cep?${query}`, {
          signal: controle.signal,
        })
        const envelope = (await resposta.json()) as Envelope<BuscaReversa>

        if (envelope.ok) {
          guardar({ busca: envelope.data, erro: null })
        } else if (envelope.erro.codigo === 'nao_encontrado') {
          guardar({ busca: { enderecos: [], truncado: false }, erro: null })
        } else {
          guardar({ busca: null, erro: envelope.erro.mensagem })
        }
      } catch {
        if (!controle.signal.aborted) {
          guardar({
            busca: null,
            erro: 'Não foi possível buscar as ruas agora.',
          })
        }
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
