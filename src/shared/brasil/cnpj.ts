const TAMANHO_CNPJ = 14
const PESOS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

const limparCnpj = (bruto: string) =>
  bruto.toUpperCase().replace(/[^0-9A-Z]/g, '')

const valorDoCaractere = (caractere: string) => caractere.charCodeAt(0) - 48

const digitoVerificador = (base: string) => {
  const pesos = PESOS.slice(PESOS.length - base.length)
  const soma = [...base].reduce(
    (total, caractere, indice) =>
      total + valorDoCaractere(caractere) * (pesos[indice] ?? 0),
    0,
  )
  const resto = soma % 11

  return resto < 2 ? 0 : 11 - resto
}

const normalizarCnpj = (bruto: string): string | null => {
  const cnpj = limparCnpj(bruto)

  if (!/^[0-9A-Z]{12}\d{2}$/.test(cnpj) || /^(.)\1+$/.test(cnpj)) {
    return null
  }

  const base = cnpj.slice(0, 12)
  const primeiro = digitoVerificador(base)
  const segundo = digitoVerificador(`${base}${primeiro}`)

  return cnpj.endsWith(`${primeiro}${segundo}`) ? cnpj : null
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

export { formatarCnpj, limparCnpj, normalizarCnpj, TAMANHO_CNPJ }
