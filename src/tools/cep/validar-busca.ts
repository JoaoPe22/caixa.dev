import { ufValida } from '@/shared/brasil/ufs'

import { MINIMO_TERMO } from './constantes'

type BuscaReversaEntrada = {
  uf: string
  cidade: string
  rua: string
}

const validarBuscaReversa = ({
  uf,
  cidade,
  rua,
}: BuscaReversaEntrada): string | null => {
  if (!ufValida(uf)) {
    return 'Selecione um estado válido.'
  }

  if (cidade.trim().length < MINIMO_TERMO) {
    return `A cidade precisa de pelo menos ${MINIMO_TERMO} letras.`
  }

  if (rua.trim().length < MINIMO_TERMO) {
    return `A rua precisa de pelo menos ${MINIMO_TERMO} letras.`
  }

  return null
}

export { validarBuscaReversa }
export type { BuscaReversaEntrada }
