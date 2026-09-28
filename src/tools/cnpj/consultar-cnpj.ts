import { garantirLimite } from '@/tools/_core/limite-de-taxa'

import { REGRA_CNPJ_CONSULTA } from './constantes'
import type { Empresa } from './empresa'
import { buscarNaOpenCnpj } from './provedores/opencnpj'

const consultarCnpj = async (cnpj: string): Promise<Empresa | null> => {
  await garantirLimite(REGRA_CNPJ_CONSULTA)

  return buscarNaOpenCnpj(cnpj)
}

export { consultarCnpj }
