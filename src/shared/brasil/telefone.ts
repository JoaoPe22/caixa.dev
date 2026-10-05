import { digitosAleatorios, inteiroAleatorio } from '@/lib/aleatorio'

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

const formatarTelefone = (numero: string) => {
  if (numero.length === 10) {
    return `(${numero.slice(0, 2)}) ${numero.slice(2, 6)}-${numero.slice(6)}`
  }

  if (numero.length === 11) {
    return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`
  }

  return numero
}

const gerarCelular = (ddd: string) =>
  `${ddd}9${inteiroAleatorio(6, 9)}${digitosAleatorios(7)}`

const gerarTelefoneFixo = (ddd: string) =>
  `${ddd}${inteiroAleatorio(2, 5)}${digitosAleatorios(7)}`

export { formatarTelefone, gerarCelular, gerarTelefoneFixo, normalizarTelefone }
