const interpretarNumero = (texto: string): number | null => {
  const limpo = texto.trim()

  if (!limpo) {
    return null
  }

  const normalizado = limpo.includes(',')
    ? limpo.replace(/\./g, '').replace(',', '.')
    : limpo
  const numero = Number(normalizado)

  return Number.isFinite(numero) ? numero : null
}

export { interpretarNumero }
