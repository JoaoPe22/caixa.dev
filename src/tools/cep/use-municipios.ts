import { useEffect, useState } from 'react'

import { consultarApi } from '@/tools/_core/cliente-api'

import type { Municipio } from './tipos'

type MunicipiosDaUf = {
  municipios: Municipio[]
  erro: string | null
}

const useMunicipios = (uf: string) => {
  const [porUf, setPorUf] = useState<Record<string, MunicipiosDaUf>>({})

  const atual = uf ? porUf[uf] : undefined
  const precisaBuscar = Boolean(uf) && !atual

  useEffect(() => {
    if (!precisaBuscar) {
      return
    }

    const controle = new AbortController()

    const carregar = async () => {
      const envelope = await consultarApi<{ municipios: Municipio[] }>(
        `/api/cep/municipios?uf=${uf}`,
        { signal: controle.signal },
      )

      if (controle.signal.aborted) {
        return
      }

      setPorUf((anterior) => ({
        ...anterior,
        [uf]: envelope.ok
          ? { municipios: envelope.data.municipios, erro: null }
          : { municipios: [], erro: envelope.erro.mensagem },
      }))
    }

    void carregar()

    return () => controle.abort()
  }, [precisaBuscar, uf])

  return {
    municipios: atual?.municipios ?? [],
    erro: atual?.erro ?? null,
    carregando: precisaBuscar,
  }
}

export { useMunicipios }
