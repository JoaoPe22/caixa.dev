import { caracteresAleatorios } from '@/lib/aleatorio'

import { digitoModulo11 } from './digito-verificador'

type OpcoesGerarCnpj = {
  alfanumerico?: boolean
  matriz?: boolean
}

const TAMANHO_CNPJ = 14
const PESOS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
const NUMEROS = '0123456789'
const ALFANUMERICOS = `${NUMEROS}ABCDEFGHIJKLMNOPQRSTUVWXYZ`
const ORDEM_MATRIZ = '0001'

const limparCnpj = (bruto: string) =>
  bruto.toUpperCase().replace(/[^0-9A-Z]/g, '')

const digitoVerificador = (base: string) =>
  digitoModulo11(base, PESOS.slice(PESOS.length - base.length))

const comDigitosVerificadores = (base: string) => {
  const primeiro = digitoVerificador(base)
  const segundo = digitoVerificador(`${base}${primeiro}`)

  return `${base}${primeiro}${segundo}`
}

const normalizarCnpj = (bruto: string): string | null => {
  const cnpj = limparCnpj(bruto)

  if (!/^[0-9A-Z]{12}\d{2}$/.test(cnpj) || /^(.)\1+$/.test(cnpj)) {
    return null
  }

  return comDigitosVerificadores(cnpj.slice(0, 12)) === cnpj ? cnpj : null
}

const formatarCnpj = (valor: string) => {
  const cnpj = limparCnpj(valor).slice(0, TAMANHO_CNPJ)
  const blocos = [cnpj.slice(0, 2), cnpj.slice(2, 5), cnpj.slice(5, 8)]
    .filter(Boolean)
    .join('.')
  const filial = cnpj.length > 8 ? `/${cnpj.slice(8, 12)}` : ''
  const digitos = cnpj.length > 12 ? `-${cnpj.slice(12)}` : ''

  return `${blocos}${filial}${digitos}`
}

const gerarCnpj = ({
  alfanumerico = false,
  matriz = true,
}: OpcoesGerarCnpj = {}): string => {
  const alfabeto = alfanumerico ? ALFANUMERICOS : NUMEROS
  const raiz = caracteresAleatorios(8, alfabeto)
  const ordem = matriz ? ORDEM_MATRIZ : caracteresAleatorios(4, alfabeto)
  const base = `${raiz}${ordem}`

  const valida =
    ordem !== '0000' &&
    !/^(.)\1+$/.test(base) &&
    (!alfanumerico || /[A-Z]/.test(base))

  return valida
    ? comDigitosVerificadores(base)
    : gerarCnpj({ alfanumerico, matriz })
}

export { formatarCnpj, gerarCnpj, normalizarCnpj }
export type { OpcoesGerarCnpj }
