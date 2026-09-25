import { gerarPixCopiaECola } from '@/shared/brasil/pix'
import { normalizarTelefone } from '@/shared/brasil/telefone'

import type { DadosConteudo, TipoConteudo } from './tipos-conteudo'

type ResultadoPayload =
  { ok: true; payload: string } | { ok: false; erro: string | null }

type Montadores = {
  [T in TipoConteudo]: (dados: DadosConteudo[T]) => ResultadoPayload
}

const UMA_HORA_MS = 60 * 60 * 1_000
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ERRO_TELEFONE = 'Informe o telefone com DDD, por exemplo (11) 99999-9999.'

const incompleto: ResultadoPayload = { ok: false, erro: null }

const falha = (erro: string): ResultadoPayload => ({ ok: false, erro })

const sucesso = (payload: string): ResultadoPayload => ({ ok: true, payload })

const escaparWifi = (texto: string) => texto.replace(/([\\;,:"])/g, '\\$1')

const escaparTexto = (texto: string) =>
  texto
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')

const linhas = (...itens: (string | false | null)[]) =>
  itens.filter(Boolean).join('\r\n')

const urlHttp = (bruto: string): string | null => {
  const texto = bruto.trim()
  const comEsquema = /^[a-z][a-z0-9+.-]*:\/\//i.test(texto)
    ? texto
    : `https://${texto}`

  try {
    const url = new URL(comEsquema)

    return ['http:', 'https:'].includes(url.protocol) &&
      url.hostname.includes('.')
      ? url.toString()
      : null
  } catch {
    return null
  }
}

const formatarDataIcs = (data: Date) => {
  const doisDigitos = (numero: number) => String(numero).padStart(2, '0')

  return [
    data.getFullYear(),
    doisDigitos(data.getMonth() + 1),
    doisDigitos(data.getDate()),
    'T',
    doisDigitos(data.getHours()),
    doisDigitos(data.getMinutes()),
    '00',
  ].join('')
}

const interpretarValor = (texto: string): number | null | undefined => {
  const limpo = texto.trim()

  if (!limpo) {
    return null
  }

  const normalizado = limpo.includes(',')
    ? limpo.replace(/\./g, '').replace(',', '.')
    : limpo
  const numero = Number(normalizado)

  return Number.isFinite(numero) ? Math.round(numero * 100) / 100 : undefined
}

const montadores: Montadores = {
  link: ({ url }) => {
    if (!url.trim()) {
      return incompleto
    }

    const valida = urlHttp(url)

    return valida
      ? sucesso(valida)
      : falha('Informe um endereço válido, como exemplo.com.br.')
  },

  texto: ({ texto }) => (texto.trim() ? sucesso(texto) : incompleto),

  email: ({ para, assunto, mensagem }) => {
    if (!para.trim()) {
      return incompleto
    }

    if (!EMAIL.test(para.trim())) {
      return falha('Informe um e-mail válido.')
    }

    const parametros = [
      assunto.trim() && `subject=${encodeURIComponent(assunto.trim())}`,
      mensagem.trim() && `body=${encodeURIComponent(mensagem.trim())}`,
    ]
      .filter(Boolean)
      .join('&')

    return sucesso(`mailto:${para.trim()}${parametros ? `?${parametros}` : ''}`)
  },

  ligacao: ({ telefone }) => {
    if (!telefone.trim()) {
      return incompleto
    }

    const numero = normalizarTelefone(telefone)

    return numero ? sucesso(`tel:+${numero}`) : falha(ERRO_TELEFONE)
  },

  sms: ({ telefone, mensagem }) => {
    if (!telefone.trim()) {
      return incompleto
    }

    const numero = normalizarTelefone(telefone)

    return numero
      ? sucesso(`SMSTO:+${numero}:${mensagem.trim()}`)
      : falha(ERRO_TELEFONE)
  },

  whatsapp: ({ telefone, mensagem }) => {
    if (!telefone.trim()) {
      return incompleto
    }

    const numero = normalizarTelefone(telefone)

    if (!numero) {
      return falha(ERRO_TELEFONE)
    }

    const texto = mensagem.trim()

    return sucesso(
      `https://wa.me/${numero}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`,
    )
  },

  wifi: ({ rede, senha, seguranca, oculta }) => {
    if (!rede.trim()) {
      return incompleto
    }

    if (seguranca !== 'nopass' && !senha) {
      return falha('Informe a senha da rede, ou escolha "Sem senha".')
    }

    const partes = [
      `T:${seguranca};`,
      `S:${escaparWifi(rede)};`,
      seguranca === 'nopass' ? '' : `P:${escaparWifi(senha)};`,
      oculta ? 'H:true;' : '',
    ]

    return sucesso(`WIFI:${partes.join('')};`)
  },

  vcard: ({ nome, sobrenome, telefone, email, empresa, cargo, site }) => {
    const nomeCompleto = [nome.trim(), sobrenome.trim()]
      .filter(Boolean)
      .join(' ')

    if (!nomeCompleto) {
      return incompleto
    }

    const numero = telefone.trim() ? normalizarTelefone(telefone) : null
    const siteValido = site.trim() ? urlHttp(site) : null

    if (telefone.trim() && !numero) {
      return falha(ERRO_TELEFONE)
    }

    if (email.trim() && !EMAIL.test(email.trim())) {
      return falha('Informe um e-mail válido.')
    }

    if (site.trim() && !siteValido) {
      return falha('Informe um site válido, como exemplo.com.br.')
    }

    return sucesso(
      linhas(
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${escaparTexto(sobrenome.trim())};${escaparTexto(nome.trim())};;;`,
        `FN:${escaparTexto(nomeCompleto)}`,
        empresa.trim() && `ORG:${escaparTexto(empresa.trim())}`,
        cargo.trim() && `TITLE:${escaparTexto(cargo.trim())}`,
        numero && `TEL;TYPE=CELL:+${numero}`,
        email.trim() && `EMAIL:${email.trim()}`,
        siteValido && `URL:${siteValido}`,
        'END:VCARD',
      ),
    )
  },

  evento: ({ titulo, local, inicio, fim, descricao }) => {
    if (!titulo.trim() || !inicio) {
      return incompleto
    }

    const dataInicio = new Date(inicio)
    const dataFim = fim
      ? new Date(fim)
      : new Date(dataInicio.getTime() + UMA_HORA_MS)

    if (Number.isNaN(dataInicio.getTime())) {
      return falha('Informe a data e a hora de início.')
    }

    if (Number.isNaN(dataFim.getTime()) || dataFim < dataInicio) {
      return falha('O fim precisa ser depois do início.')
    }

    return sucesso(
      linhas(
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `SUMMARY:${escaparTexto(titulo.trim())}`,
        `DTSTART:${formatarDataIcs(dataInicio)}`,
        `DTEND:${formatarDataIcs(dataFim)}`,
        local.trim() && `LOCATION:${escaparTexto(local.trim())}`,
        descricao.trim() && `DESCRIPTION:${escaparTexto(descricao.trim())}`,
        'END:VEVENT',
        'END:VCALENDAR',
      ),
    )
  },

  pix: ({ tipoChave, chave, nome, cidade, valor, identificador }) => {
    if (!chave.trim() || !nome.trim() || !cidade.trim()) {
      return incompleto
    }

    const valorNumerico = interpretarValor(valor)

    if (valorNumerico === undefined) {
      return falha('Valor inválido. Use o formato 10,50.')
    }

    const resultado = gerarPixCopiaECola({
      tipoChave,
      chave,
      nome,
      cidade,
      valor: valorNumerico,
      identificador,
    })

    return resultado.ok ? sucesso(resultado.payload) : falha(resultado.erro)
  },
}

const montarPayload = <T extends TipoConteudo>(
  tipo: T,
  dados: DadosConteudo,
): ResultadoPayload => montadores[tipo](dados[tipo])

export { montarPayload }
export type { ResultadoPayload }
