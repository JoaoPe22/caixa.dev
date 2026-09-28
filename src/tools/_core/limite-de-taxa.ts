import { type Duration, Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { headers } from 'next/headers'

type RegraDeLimite = {
  nome: string
  requisicoes: number
  janela: Duration
}

const TIMEOUT_REDIS_MS = 1_000

class LimiteExcedidoError extends Error {
  readonly segundosParaLiberar: number

  constructor(segundosParaLiberar: number) {
    super(
      `Muitas consultas em pouco tempo. Aguarde ${segundosParaLiberar} segundos e tente de novo.`,
    )
    this.name = 'LimiteExcedidoError'
    this.segundosParaLiberar = segundosParaLiberar
  }
}

let redis: Redis | null | undefined
const limitadores = new Map<string, Ratelimit>()

const obterRedis = () => {
  if (redis !== undefined) {
    return redis
  }

  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN

  if (!url || !token) {
    console.warn(
      'Rate limit desligado: defina KV_REST_API_URL e KV_REST_API_TOKEN para ativá-lo.',
    )
  }

  redis = url && token ? new Redis({ url, token }) : null

  return redis
}

const obterLimitador = (regra: RegraDeLimite) => {
  const conexao = obterRedis()

  if (!conexao) {
    return null
  }

  const existente = limitadores.get(regra.nome)

  if (existente) {
    return existente
  }

  const limitador = new Ratelimit({
    redis: conexao,
    limiter: Ratelimit.slidingWindow(regra.requisicoes, regra.janela),
    prefix: `limite:${regra.nome}`,
    timeout: TIMEOUT_REDIS_MS,
    ephemeralCache: new Map(),
  })

  limitadores.set(regra.nome, limitador)

  return limitador
}

const ipDoCliente = async () => {
  const cabecalhos = await headers()

  return (
    cabecalhos.get('x-real-ip') ??
    cabecalhos.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'desconhecido'
  )
}

const garantirLimite = async (regra: RegraDeLimite, identificador?: string) => {
  const limitador = obterLimitador(regra)

  if (!limitador) {
    return
  }

  const chave = identificador ?? (await ipDoCliente())

  let resultado: Awaited<ReturnType<Ratelimit['limit']>>

  try {
    resultado = await limitador.limit(chave)
  } catch {
    return
  }

  if (!resultado.success) {
    throw new LimiteExcedidoError(
      Math.max(1, Math.ceil((resultado.reset - Date.now()) / 1000)),
    )
  }
}

export { garantirLimite, LimiteExcedidoError }
export type { RegraDeLimite }
