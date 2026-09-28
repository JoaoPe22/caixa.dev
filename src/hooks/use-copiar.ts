import { useState } from 'react'

const DURACAO_CONFIRMACAO_MS = 1_500

const useCopiar = () => {
  const [copiado, setCopiado] = useState(false)

  const copiar = async (texto: string) => {
    await navigator.clipboard.writeText(texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), DURACAO_CONFIRMACAO_MS)
  }

  return { copiado, copiar }
}

export { useCopiar }
