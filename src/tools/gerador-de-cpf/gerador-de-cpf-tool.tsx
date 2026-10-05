import { GeradorDeCpfForm } from './gerador-de-cpf-form'
import { gerarCpfs, opcoesPadrao } from './gerar-cpfs'

const GeradorDeCpfTool = () => (
  <GeradorDeCpfForm inicial={gerarCpfs(opcoesPadrao)} />
)

export default GeradorDeCpfTool
