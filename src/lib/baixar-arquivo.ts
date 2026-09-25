const baixarArquivo = (conteudo: Blob, nomeArquivo: string) => {
  const url = URL.createObjectURL(conteudo)
  const link = document.createElement('a')

  link.href = url
  link.download = nomeArquivo
  link.click()

  setTimeout(() => URL.revokeObjectURL(url), 1_000)
}

export { baixarArquivo }
