import { normalizarCnpj } from '@/shared/brasil/cnpj'
import {
  comTratamentoDeErro,
  erroEntradaInvalida,
  erroNaoEncontrado,
  respostaOk,
} from '@/tools/_core/api-helpers'

import {
  MENSAGEM_CNPJ_INVALIDO,
  MENSAGEM_CNPJ_NAO_ENCONTRADO,
  REVALIDATE_CNPJ,
} from './constantes'
import { consultarCnpj } from './consultar-cnpj'

const getCnpj = async (request: Request) =>
  comTratamentoDeErro(async () => {
    const cnpj = normalizarCnpj(
      new URL(request.url).searchParams.get('cnpj') ?? '',
    )

    if (!cnpj) {
      return erroEntradaInvalida(MENSAGEM_CNPJ_INVALIDO)
    }

    const empresa = await consultarCnpj(cnpj)

    if (!empresa) {
      return erroNaoEncontrado(MENSAGEM_CNPJ_NAO_ENCONTRADO)
    }

    return respostaOk(empresa, REVALIDATE_CNPJ)
  })

export { getCnpj }
