const normalizarTexto = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()

const paraSlug = (texto: string, separador = '-') =>
  normalizarTexto(texto)
    .replace(/[^a-z0-9]+/g, separador)
    .replace(new RegExp(`^\\${separador}+|\\${separador}+$`, 'g'), '')

const camelParaSnake = (texto: string) =>
  texto.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()

export { camelParaSnake, normalizarTexto, paraSlug }
