import { ufValida } from '@/shared/brasil/ufs'
import {
  comTratamentoDeErro,
  erroEntradaInvalida,
  respostaOk,
} from '@/tools/_core/api-helpers'

import { REVALIDATE_IBGE } from './constantes'
import { listarMunicipios } from './municipios'

const getMunicipios = async (request: Request) =>
  comTratamentoDeErro(async () => {
    const uf = (new URL(request.url).searchParams.get('uf') ?? '')
      .trim()
      .toUpperCase()

    if (!ufValida(uf)) {
      return erroEntradaInvalida('Selecione um estado válido.')
    }

    const municipios = await listarMunicipios(uf)

    return respostaOk({ municipios }, REVALIDATE_IBGE)
  })

export { getMunicipios }
