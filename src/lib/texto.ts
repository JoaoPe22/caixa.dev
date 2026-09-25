const normalizarTexto = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()

export { normalizarTexto }
