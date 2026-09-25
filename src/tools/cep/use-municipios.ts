import { useEffect, useState } from 'react'

import type { Envelope } from '@/tools/_core/api-helpers'

import type { Municipio } from './municipios'

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
      try {
        const resposta = await fetch(`/api/cep/municipios?uf=${uf}`, {
          signal: controle.signal,
        })
        const envelope = (await resposta.json()) as Envelope<{
          municipios: Municipio[]
        }>

        setPorUf((anterior) => ({
          ...anterior,
          [uf]: envelope.ok
            ? { municipios: envelope.data.municipios, erro: null }
            : { municipios: [], erro: envelope.erro.mensagem },
        }))
      } catch {
        if (controle.signal.aborted) {
          return
        }

        setPorUf((anterior) => ({
          ...anterior,
          [uf]: {
            municipios: [],
            erro: 'Não foi possível carregar os municípios.',
          },
        }))
      }
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
