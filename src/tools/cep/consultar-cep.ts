import { z } from 'zod'

import { buscarJson } from '@/tools/_core/api-helpers'
import { garantirLimite } from '@/tools/_core/limite-de-taxa'

import {
  LIMITE_VIACEP,
  REGRA_CEP_BUSCA_RUA,
  REGRA_CEP_CONSULTA,
  REVALIDATE_CEP,
  REVALIDATE_IBGE,
  TIMEOUT_IBGE_MS,
} from './constantes'
import type { BuscaReversa, CepResultado, Endereco } from './tipos'

const viaCepSucessoSchema = z.object({
  cep: z.string(),
  logradouro: z.string(),
  complemento: z.string().default(''),
  unidade: z.string().default(''),
  bairro: z.string(),
  localidade: z.string(),
  uf: z.string(),
  estado: z.string().default(''),
  regiao: z.string().default(''),
  ibge: z.string().default(''),
  ddd: z.string().default(''),
})

const viaCepErroSchema = z.object({
  erro: z.union([z.literal('true'), z.literal(true)]),
})

const viaCepSchema = z.union([viaCepErroSchema, viaCepSucessoSchema])

const viaCepListaSchema = z.array(viaCepSucessoSchema)

const ibgeMunicipioSchema = z.object({
  nome: z.string(),
  microrregiao: z
    .object({
      nome: z.string(),
      mesorregiao: z.object({ nome: z.string() }),
    })
    .optional(),
})

type ViaCepSucesso = z.infer<typeof viaCepSucessoSchema>

const paraEndereco = (bruto: ViaCepSucesso): Endereco => ({
  cep: bruto.cep,
  logradouro: bruto.logradouro,
  complemento: bruto.complemento,
  unidade: bruto.unidade,
  bairro: bruto.bairro,
  cidade: bruto.localidade,
  uf: bruto.uf,
  estado: bruto.estado,
  regiao: bruto.regiao,
  ddd: bruto.ddd,
  ibge: bruto.ibge,
})

const buscarRegioesIbge = async (codigoIbge: string) => {
  if (!codigoIbge) {
    return { microrregiao: null, mesorregiao: null }
  }

  try {
    const municipio = await buscarJson(
      `https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${codigoIbge}`,
      {
        servico: 'ibge',
        revalidate: REVALIDATE_IBGE,
        schema: ibgeMunicipioSchema,
        timeoutMs: TIMEOUT_IBGE_MS,
      },
    )

    return {
      microrregiao: municipio.microrregiao?.nome ?? null,
      mesorregiao: municipio.microrregiao?.mesorregiao.nome ?? null,
    }
  } catch {
    return { microrregiao: null, mesorregiao: null }
  }
}

const consultarCep = async (cep: string): Promise<CepResultado | null> => {
  await garantirLimite(REGRA_CEP_CONSULTA)

  const resposta = await buscarJson(`https://viacep.com.br/ws/${cep}/json/`, {
    servico: 'viacep',
    revalidate: REVALIDATE_CEP,
    schema: viaCepSchema,
  })

  if ('erro' in resposta) {
    return null
  }

  const regioes = await buscarRegioesIbge(resposta.ibge)

  return { ...paraEndereco(resposta), ...regioes }
}

const variantesDaCidade = (cidade: string) => {
  const semHifen = cidade.replace(/-/g, ' ')

  return semHifen === cidade ? [cidade] : [cidade, semHifen]
}

const buscarEnderecos = async (
  uf: string,
  cidade: string,
  rua: string,
): Promise<BuscaReversa> => {
  await garantirLimite(REGRA_CEP_BUSCA_RUA)

  for (const variante of variantesDaCidade(cidade)) {
    const caminho = [uf, variante, rua].map(encodeURIComponent).join('/')

    const lista = await buscarJson(
      `https://viacep.com.br/ws/${caminho}/json/`,
      {
        servico: 'viacep',
        revalidate: REVALIDATE_CEP,
        schema: viaCepListaSchema,
      },
    )

    if (lista.length > 0) {
      return {
        enderecos: lista.map(paraEndereco),
        truncado: lista.length >= LIMITE_VIACEP,
      }
    }
  }

  return { enderecos: [], truncado: false }
}

export { buscarEnderecos, consultarCep }
