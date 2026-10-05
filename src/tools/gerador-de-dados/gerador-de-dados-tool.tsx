import { opcoesGeracaoPadrao } from './constantes'
import { GeradorDeDadosForm } from './gerador-de-dados-form'
import { gerarRegistros } from './gerar-registros'

const GeradorDeDadosTool = () => (
  <GeradorDeDadosForm inicial={gerarRegistros(opcoesGeracaoPadrao)} />
)

export default GeradorDeDadosTool
