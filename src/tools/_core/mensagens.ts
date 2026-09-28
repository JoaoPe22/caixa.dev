import { LimiteExcedidoError } from './erros'

const MENSAGEM_FALHA_CONSULTA =
  'Não foi possível consultar agora. Tente de novo.'

const mensagemDeFalha = (falha: unknown) =>
  falha instanceof LimiteExcedidoError ? falha.message : MENSAGEM_FALHA_CONSULTA

export { MENSAGEM_FALHA_CONSULTA, mensagemDeFalha }
