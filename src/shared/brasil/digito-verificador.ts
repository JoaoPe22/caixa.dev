const valorDoCaractere = (caractere: string) => caractere.charCodeAt(0) - 48

const digitoModulo11 = (base: string, pesos: readonly number[]) => {
  const soma = [...base].reduce(
    (total, caractere, indice) =>
      total + valorDoCaractere(caractere) * (pesos[indice] ?? 0),
    0,
  )
  const resto = soma % 11

  return resto < 2 ? 0 : 11 - resto
}

const pesosDecrescentes = (tamanho: number) =>
  Array.from({ length: tamanho }, (_, indice) => tamanho + 1 - indice)

export { digitoModulo11, pesosDecrescentes }
