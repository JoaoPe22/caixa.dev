import { z } from 'zod'

import { buscarJson } from '@/tools/_core/api-helpers'

import { REVALIDATE_IBGE } from './constantes'

const municipiosSchema = z.array(
  z.object({
    id: z.number(),
    nome: z.string(),
  }),
)

type Municipio = {
  nome: string
  ibge: string
}

const listarMunicipios = async (uf: string): Promise<Municipio[]> => {
  const lista = await buscarJson(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
    {
      revalidate: REVALIDATE_IBGE,
      schema: municipiosSchema,
    },
  )

  return lista
    .map((municipio) => ({ nome: municipio.nome, ibge: String(municipio.id) }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
}

export { listarMunicipios }
export type { Municipio }
