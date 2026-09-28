const normalizarCep = (bruto: string): string | null => {
  const digitos = bruto.replace(/\D/g, '')

  return digitos.length === 8 ? digitos : null
}

const formatarCep = (cep: string): string => {
  const digitos = cep.replace(/\D/g, '')

  return digitos.length === 8
    ? `${digitos.slice(0, 5)}-${digitos.slice(5)}`
    : cep
}

export { formatarCep, normalizarCep }
