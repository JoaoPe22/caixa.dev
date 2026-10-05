import { gerarCpf } from '@/shared/brasil/cpf'

type OpcoesGeradorCpf = {
  uf: string
  quantidade: number
}

const opcoesPadrao: OpcoesGeradorCpf = {
  uf: '',
  quantidade: 10,
}

const gerarCpfs = ({ uf, quantidade }: OpcoesGeradorCpf) =>
  Array.from({ length: quantidade }, () => gerarCpf({ uf }))

export { gerarCpfs, opcoesPadrao }
export type { OpcoesGeradorCpf }
