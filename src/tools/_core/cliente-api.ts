import type { Envelope } from './api-helpers'
import { MENSAGEM_FALHA_CONSULTA } from './mensagens'

type ConsultarApiOpts = {
  signal?: AbortSignal
}

const consultarApi = async <T>(
  url: string,
  { signal }: ConsultarApiOpts = {},
): Promise<Envelope<T>> => {
  try {
    const resposta = await fetch(url, { signal })

    return (await resposta.json()) as Envelope<T>
  } catch {
    return {
      ok: false,
      erro: { codigo: 'falha_de_rede', mensagem: MENSAGEM_FALHA_CONSULTA },
    }
  }
}

export { consultarApi }
