import { chance } from '@/lib/aleatorio'
import { gerarCnpj } from '@/shared/brasil/cnpj'

type FormatoCnpj = 'numerico' | 'alfanumerico' | 'misto'

type OpcoesGeradorCnpj = {
  formato: FormatoCnpj
  matriz: boolean
  quantidade: number
}

const opcoesPadrao: OpcoesGeradorCnpj = {
  formato: 'numerico',
  matriz: true,
  quantidade: 10,
}

const formatos: { id: FormatoCnpj; rotulo: string }[] = [
  { id: 'numerico', rotulo: 'Numérico' },
  { id: 'alfanumerico', rotulo: 'Alfanumérico' },
  { id: 'misto', rotulo: 'Misto' },
]

const alfanumerico = (formato: FormatoCnpj) =>
  formato === 'misto' ? chance(0.5) : formato === 'alfanumerico'

const gerarCnpjs = ({ formato, matriz, quantidade }: OpcoesGeradorCnpj) =>
  Array.from({ length: quantidade }, () =>
    gerarCnpj({ alfanumerico: alfanumerico(formato), matriz }),
  )

export { formatos, gerarCnpjs, opcoesPadrao }
export type { FormatoCnpj, OpcoesGeradorCnpj }
