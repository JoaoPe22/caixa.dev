import type { RegraDeLimite } from '@/tools/_core/limite-de-taxa'

const REVALIDATE_CNPJ = 60 * 60 * 24 * 7
const MENSAGEM_CNPJ_INVALIDO =
  'Informe um CNPJ válido: 14 caracteres, com os dígitos verificadores corretos.'
const MENSAGEM_CNPJ_NAO_ENCONTRADO =
  'CNPJ não encontrado na base da Receita Federal.'
const REGRA_CNPJ_CONSULTA = {
  nome: 'cnpj-consulta',
  requisicoes: 20,
  janela: '60 s',
} satisfies RegraDeLimite

export {
  MENSAGEM_CNPJ_INVALIDO,
  MENSAGEM_CNPJ_NAO_ENCONTRADO,
  REGRA_CNPJ_CONSULTA,
  REVALIDATE_CNPJ,
}
