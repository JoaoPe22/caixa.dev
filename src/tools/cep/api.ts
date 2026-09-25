import {
  comTratamentoDeErro,
  erroEntradaInvalida,
  erroNaoEncontrado,
  respostaOk,
} from '@/tools/_core/api-helpers'

import { MINIMO_TERMO, REVALIDATE_CEP } from './constantes'
import { buscarEnderecos, consultarCep } from './consultar-cep'
import { normalizarCep } from './normalizar-cep'
import { validarBuscaReversa } from './validar-busca'

const getCep = async (request: Request) =>
  comTratamentoDeErro(async () => {
    const params = new URL(request.url).searchParams
    const uf = (params.get('uf') ?? '').trim()
    const cidade = (params.get('cidade') ?? '').trim()
    const rua = (params.get('rua') ?? '').trim()

    if (uf || cidade || rua) {
      const invalido = validarBuscaReversa({ uf, cidade, rua })

      if (invalido) {
        return erroEntradaInvalida(invalido)
      }

      const busca = await buscarEnderecos(uf.toUpperCase(), cidade, rua)

      if (busca.enderecos.length === 0) {
        return erroNaoEncontrado(
          `Nenhum endereço encontrado para "${rua}" em ${cidade}.`,
        )
      }

      return respostaOk(busca, REVALIDATE_CEP)
    }

    const cep = normalizarCep(params.get('cep') ?? '')

    if (!cep) {
      return erroEntradaInvalida(
        `Informe um CEP com 8 dígitos, ou um estado, cidade e rua com pelo menos ${MINIMO_TERMO} letras.`,
      )
    }

    const resultado = await consultarCep(cep)

    if (!resultado) {
      return erroNaoEncontrado('CEP não encontrado.')
    }

    return respostaOk(resultado, REVALIDATE_CEP)
  })

export { getCep }
