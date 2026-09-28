import { garantirLimite } from '@/tools/_core/limite-de-taxa'

import { REGRA_CNPJ_CONSULTA } from './constantes'
import { buscarNaOpenCnpj } from './provedores/opencnpj'
import type { Empresa } from './tipos'

const consultarCnpj = async (cnpj: string): Promise<Empresa | null> => {
  await garantirLimite(REGRA_CNPJ_CONSULTA)

  return buscarNaOpenCnpj(cnpj)
}

export { consultarCnpj }
