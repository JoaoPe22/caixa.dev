import { GeradorDeCnpjForm } from './gerador-de-cnpj-form'
import { gerarCnpjs, opcoesPadrao } from './gerar-cnpjs'

const GeradorDeCnpjTool = () => (
  <GeradorDeCnpjForm inicial={gerarCnpjs(opcoesPadrao)} />
)

export default GeradorDeCnpjTool
