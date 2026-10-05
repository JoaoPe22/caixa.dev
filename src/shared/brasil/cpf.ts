import { digitosAleatorios, inteiroAleatorio } from '@/lib/aleatorio'

import { digitoModulo11, pesosDecrescentes } from './digito-verificador'

type OpcoesGerarCpf = {
  uf?: string
}

// O 9º dígito do CPF indica a região fiscal onde ele foi emitido.
const REGIAO_FISCAL_POR_UF: Record<string, number> = {
  RS: 0,
  DF: 1,
  GO: 1,
  MS: 1,
  MT: 1,
  TO: 1,
  AC: 2,
  AM: 2,
  AP: 2,
  PA: 2,
  RO: 2,
  RR: 2,
  CE: 3,
  MA: 3,
  PI: 3,
  AL: 4,
  PB: 4,
  PE: 4,
  RN: 4,
  BA: 5,
  SE: 5,
  MG: 6,
  ES: 7,
  RJ: 7,
  SP: 8,
  PR: 9,
  SC: 9,
}

const comDigitosVerificadores = (base: string) => {
  const primeiro = digitoModulo11(base, pesosDecrescentes(9))
  const segundo = digitoModulo11(`${base}${primeiro}`, pesosDecrescentes(10))

  return `${base}${primeiro}${segundo}`
}

const normalizarCpf = (bruto: string): string | null => {
  const cpf = bruto.replace(/\D/g, '')

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return null
  }

  return comDigitosVerificadores(cpf.slice(0, 9)) === cpf ? cpf : null
}

const formatarCpf = (valor: string) => {
  const cpf = valor.replace(/\D/g, '').slice(0, 11)
  const blocos = [cpf.slice(0, 3), cpf.slice(3, 6), cpf.slice(6, 9)]
    .filter(Boolean)
    .join('.')
  const digitos = cpf.length > 9 ? `-${cpf.slice(9)}` : ''

  return `${blocos}${digitos}`
}

const gerarCpf = ({ uf }: OpcoesGerarCpf = {}): string => {
  const regiao = uf
    ? REGIAO_FISCAL_POR_UF[uf.toUpperCase()]
    : inteiroAleatorio(0, 9)
  const base = `${digitosAleatorios(8)}${regiao ?? inteiroAleatorio(0, 9)}`

  return /^(\d)\1+$/.test(base)
    ? gerarCpf({ uf })
    : comDigitosVerificadores(base)
}

export { formatarCpf, gerarCpf, normalizarCpf }
export type { OpcoesGerarCpf }
