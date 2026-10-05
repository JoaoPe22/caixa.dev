const BITS_ALTOS_SEGUROS = 0x1fffff

const inteiroAleatorio = (minimo: number, maximo: number) => {
  const [alto = 0, baixo = 0] = crypto.getRandomValues(new Uint32Array(2))
  const sorteado = (alto & BITS_ALTOS_SEGUROS) * 2 ** 32 + baixo

  return minimo + (sorteado % (maximo - minimo + 1))
}

const escolher = <T>(lista: readonly T[]): T => {
  const item = lista[inteiroAleatorio(0, lista.length - 1)]

  if (item === undefined) {
    throw new Error('Não é possível escolher de uma lista vazia.')
  }

  return item
}

const chance = (probabilidade: number) =>
  inteiroAleatorio(1, 10_000) <= probabilidade * 10_000

const caracteresAleatorios = (quantidade: number, alfabeto: string) =>
  Array.from({ length: quantidade }, () => escolher([...alfabeto])).join('')

const digitosAleatorios = (quantidade: number) =>
  caracteresAleatorios(quantidade, '0123456789')

const dataAleatoria = (minimo: Date, maximo: Date) =>
  new Date(inteiroAleatorio(minimo.getTime(), maximo.getTime()))

export {
  caracteresAleatorios,
  chance,
  dataAleatoria,
  digitosAleatorios,
  escolher,
  inteiroAleatorio,
}
