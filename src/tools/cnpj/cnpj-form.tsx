'use client'

import { EraserIcon, SearchIcon } from 'lucide-react'
import type { ChangeEvent, FormEvent } from 'react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatarCnpj, normalizarCnpj } from '@/shared/brasil/cnpj'
import type { Envelope } from '@/tools/_core/api-helpers'

import { MENSAGEM_CNPJ_INVALIDO } from './constantes'
import type { Empresa } from './empresa'
import { ResultadoCnpj } from './resultado-cnpj'

type EstadoInicial = {
  cnpj: string
  empresa: Empresa | null
  erro: string | null
}

type CnpjFormProps = {
  inicial: EstadoInicial
}

const CnpjForm = ({ inicial }: CnpjFormProps) => {
  const [cnpj, setCnpj] = useState(inicial.cnpj)
  const [empresa, setEmpresa] = useState(inicial.empresa)
  const [erro, setErro] = useState(inicial.erro)
  const [consultando, setConsultando] = useState(false)
  const campoCnpjRef = useRef<HTMLInputElement>(null)

  const temAlgoParaLimpar = cnpj.length > 0 || empresa !== null || erro !== null

  const limparTudo = () => {
    setCnpj('')
    setEmpresa(null)
    setErro(null)
    window.history.replaceState(null, '', '/cnpj')
    campoCnpjRef.current?.focus()
  }

  const aoDigitarCnpj = (evento: ChangeEvent<HTMLInputElement>) => {
    setCnpj(formatarCnpj(evento.target.value))
  }

  const consultar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    const cnpjNormalizado = normalizarCnpj(cnpj)

    if (!cnpjNormalizado) {
      setEmpresa(null)
      setErro(MENSAGEM_CNPJ_INVALIDO)
      return
    }

    setConsultando(true)
    setErro(null)

    try {
      const resposta = await fetch(`/api/cnpj?cnpj=${cnpjNormalizado}`)
      const envelope = (await resposta.json()) as Envelope<Empresa>

      if (envelope.ok) {
        setEmpresa(envelope.data)
        window.history.replaceState(null, '', `/cnpj/${cnpjNormalizado}`)
      } else {
        setEmpresa(null)
        setErro(envelope.erro.mensagem)
      }
    } catch {
      setEmpresa(null)
      setErro('Não foi possível consultar agora. Tente de novo.')
    } finally {
      setConsultando(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">CNPJ</h2>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={limparTudo}
            disabled={!temAlgoParaLimpar || consultando}
          >
            <EraserIcon className="size-4" />
            Limpar tudo
          </Button>
        </div>

        <form onSubmit={consultar} className="flex gap-2">
          <Input
            ref={campoCnpjRef}
            value={cnpj}
            onChange={aoDigitarCnpj}
            placeholder="00.000.000/0001-91"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            aria-label="CNPJ"
            autoFocus={!inicial.empresa}
            className="max-w-56 font-mono"
          />

          <Button type="submit" disabled={consultando}>
            <SearchIcon className="size-4" />
            {consultando ? 'Consultando…' : 'Consultar'}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">
          Aceita o formato numérico e o novo CNPJ alfanumérico. Os dados vêm da
          base pública da Receita Federal e não são armazenados.
        </p>
      </section>

      {erro ? (
        <p
          role="status"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm"
        >
          {erro}
        </p>
      ) : null}

      {empresa ? <ResultadoCnpj empresa={empresa} /> : null}
    </div>
  )
}

export { CnpjForm }
