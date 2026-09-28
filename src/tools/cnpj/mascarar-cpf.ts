const CPF_NO_TEXTO = /\b(\d{3})\.?(\d{3})\.?(\d{3})-?(\d{2})\b/g

const mascararCpfNoTexto = (texto: string) =>
  texto.replace(
    CPF_NO_TEXTO,
    (_cpf, _inicio, meio1: string, meio2: string) => `***${meio1}${meio2}**`,
  )

export { mascararCpfNoTexto }
