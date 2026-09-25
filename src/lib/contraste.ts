const corHexValida = (cor: string) => /^#[0-9a-f]{6}$/i.test(cor)

const canalLinear = (valor: number) => {
  const canal = valor / 255

  return canal <= 0.03928 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4
}

const luminancia = (cor: string) => {
  const numero = Number.parseInt(cor.slice(1), 16)
  const vermelho = (numero >> 16) & 255
  const verde = (numero >> 8) & 255
  const azul = numero & 255

  return (
    0.2126 * canalLinear(vermelho) +
    0.7152 * canalLinear(verde) +
    0.0722 * canalLinear(azul)
  )
}

const razaoDeContraste = (corA: string, corB: string) => {
  const [clara, escura] = [luminancia(corA), luminancia(corB)].sort(
    (a, b) => b - a,
  )

  return (clara + 0.05) / (escura + 0.05)
}

export { corHexValida, luminancia, razaoDeContraste }
