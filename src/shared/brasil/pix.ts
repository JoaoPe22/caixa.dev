import { normalizarTelefone } from './telefone'

type TipoChavePix = 'cpf' | 'cnpj' | 'telefone' | 'email' | 'aleatoria'

type PixEntrada = {
  tipoChave: TipoChavePix
  chave: string
  nome: string
  cidade: string
  valor: number | null
  identificador: string
}

type ResultadoPix = { ok: true; payload: string } | { ok: false; erro: string }

const GUI_PIX = 'br.gov.bcb.pix'
const LIMITE_NOME = 25
const LIMITE_CIDADE = 15
const LIMITE_IDENTIFICADOR = 25
const VALOR_MAXIMO = 9_999_999_999.99

const tiposDeChave: { id: TipoChavePix; rotulo: string }[] = [
  { id: 'cpf', rotulo: 'CPF' },
  { id: 'cnpj', rotulo: 'CNPJ' },
  { id: 'telefone', rotulo: 'Telefone' },
  { id: 'email', rotulo: 'E-mail' },
  { id: 'aleatoria', rotulo: 'Chave aleatória' },
]

const erroDaChave: Record<TipoChavePix, string> = {
  cpf: 'O CPF precisa ter 11 dígitos.',
  cnpj: 'O CNPJ precisa ter 14 dígitos.',
  telefone: 'Informe o telefone com DDD, por exemplo (11) 99999-9999.',
  email: 'Informe um e-mail válido.',
  aleatoria:
    'A chave aleatória tem o formato 123e4567-e89b-12d3-a456-426614174000.',
}

const campo = (id: string, valor: string) =>
  `${id}${String(valor.length).padStart(2, '0')}${valor}`

const somenteAscii = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const normalizarChave = (tipo: TipoChavePix, bruto: string): string | null => {
  const texto = bruto.trim()
  const digitos = texto.replace(/\D/g, '')

  switch (tipo) {
    case 'cpf':
      return digitos.length === 11 ? digitos : null
    case 'cnpj':
      return digitos.length === 14 ? digitos : null
    case 'telefone': {
      const telefone = normalizarTelefone(texto)

      return telefone?.startsWith('55') ? `+${telefone}` : null
    }
    case 'email': {
      const email = texto.toLowerCase()

      return email.length <= 77 &&
        /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)
        ? email
        : null
    }
    case 'aleatoria': {
      const chave = texto.toLowerCase()

      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
        chave,
      )
        ? chave
        : null
    }
  }
}

const crc16 = (texto: string) => {
  let crc = 0xffff

  for (const byte of new TextEncoder().encode(texto)) {
    crc ^= byte << 8

    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0')
}

const gerarPixCopiaECola = (entrada: PixEntrada): ResultadoPix => {
  const chave = normalizarChave(entrada.tipoChave, entrada.chave)

  if (!chave) {
    return { ok: false, erro: erroDaChave[entrada.tipoChave] }
  }

  const nome = somenteAscii(entrada.nome).slice(0, LIMITE_NOME)
  const cidade = somenteAscii(entrada.cidade).slice(0, LIMITE_CIDADE)

  if (!nome) {
    return { ok: false, erro: 'Informe o nome de quem recebe.' }
  }

  if (!cidade) {
    return { ok: false, erro: 'Informe a cidade de quem recebe.' }
  }

  if (
    entrada.valor !== null &&
    !(entrada.valor > 0 && entrada.valor <= VALOR_MAXIMO)
  ) {
    return { ok: false, erro: 'Informe um valor maior que zero.' }
  }

  const identificador =
    entrada.identificador
      .replace(/[^A-Za-z0-9]/g, '')
      .slice(0, LIMITE_IDENTIFICADOR) || '***'

  const semCrc = [
    campo('00', '01'),
    campo('26', campo('00', GUI_PIX) + campo('01', chave)),
    campo('52', '0000'),
    campo('53', '986'),
    entrada.valor === null ? '' : campo('54', entrada.valor.toFixed(2)),
    campo('58', 'BR'),
    campo('59', nome),
    campo('60', cidade),
    campo('62', campo('05', identificador)),
    '6304',
  ].join('')

  return { ok: true, payload: semCrc + crc16(semCrc) }
}

export {
  gerarPixCopiaECola,
  LIMITE_CIDADE,
  LIMITE_IDENTIFICADOR,
  LIMITE_NOME,
  tiposDeChave,
}
export type { PixEntrada, ResultadoPix, TipoChavePix }
