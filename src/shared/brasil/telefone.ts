const normalizarTelefone = (bruto: string): string | null => {
  const texto = bruto.trim()
  const digitos = texto.replace(/\D/g, '')

  if (texto.startsWith('+')) {
    return digitos.length >= 8 && digitos.length <= 15 ? digitos : null
  }

  if (digitos.startsWith('55') && [12, 13].includes(digitos.length)) {
    return digitos
  }

  if ([10, 11].includes(digitos.length)) {
    return `55${digitos}`
  }

  return null
}

export { normalizarTelefone }
