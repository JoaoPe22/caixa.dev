import type { RegraDeLimite } from '@/tools/_core/limite-de-taxa'

const REVALIDATE_CEP =60 * 60 * 24 * 30
const REVALIDATE_IBGE = 60 * 60 * 24 * 180
const TIMEOUT_IBGE_MS = 2_000
const LIMITE_VIACEP = 50
const MINIMO_TERMO = 3
const ATRASO_SUGESTOES_MS = 300
const LIMITE_SUGESTOES = 50
const REGRA_CEP_CONSULTA = {
  nome: 'cep-consulta',
  requisicoes: 30,
  janela: '60 s',
} satisfies RegraDeLimite
const REGRA_CEP_BUSCA_RUA = {
  nome: 'cep-busca-rua',
  requisicoes: 20,
  janela: '60 s',
} satisfies RegraDeLimite

export {
  ATRASO_SUGESTOES_MS,
  LIMITE_SUGESTOES,
  LIMITE_VIACEP,
  MINIMO_TERMO,
  REGRA_CEP_BUSCA_RUA,
  REGRA_CEP_CONSULTA,
  REVALIDATE_CEP,
  REVALIDATE_IBGE,
  TIMEOUT_IBGE_MS,
}
