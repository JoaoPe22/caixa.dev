'use client'

import { Command as CommandPrimitive } from 'cmdk'
import { LoaderCircleIcon } from 'lucide-react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { useRef, useState } from 'react'

import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'

type Sugestao = {
  valor: string
  rotulo: string
  detalhe?: string
}

type CampoSugestoesProps = {
  rotulo: string
  valor: string
  aoMudar: (valor: string) => void
  aoEscolher: (sugestao: Sugestao) => void
  sugestoes: Sugestao[]
  carregando?: boolean
  mensagemVazia?: ReactNode
  rodape?: ReactNode
  placeholder?: string
  disabled?: boolean
}

const classeCampo =
  'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80'

const CampoSugestoes = ({
  rotulo,
  valor,
  aoMudar,
  aoEscolher,
  sugestoes,
  carregando = false,
  mensagemVazia,
  rodape,
  placeholder,
  disabled = false,
}: CampoSugestoesProps) => {
  const [aberto, setAberto] = useState(false)
  const ancoraRef = useRef<HTMLDivElement>(null)

  const temConteudo =
    carregando || sugestoes.length > 0 || Boolean(mensagemVazia)
  const listaVisivel = aberto && !disabled && temConteudo

  const aoTeclar = (evento: ReactKeyboardEvent<HTMLInputElement>) => {
    if (evento.key === 'Escape') {
      setAberto(false)
      return
    }

    if (evento.key === 'ArrowDown' && !aberto) {
      setAberto(true)
      return
    }

    if (evento.key === 'Enter' && (!listaVisivel || sugestoes.length === 0)) {
      evento.stopPropagation()
      setAberto(false)
    }
  }

  const escolher = (sugestao: Sugestao) => {
    aoEscolher(sugestao)
    setAberto(false)
  }

  return (
    <CommandPrimitive shouldFilter={false} label={rotulo} loop>
      <Popover open={listaVisivel} onOpenChange={setAberto}>
        <PopoverAnchor asChild>
          <div ref={ancoraRef}>
            <CommandPrimitive.Input
              value={valor}
              onValueChange={(novo) => {
                aoMudar(novo)
                setAberto(true)
              }}
              onFocus={() => setAberto(true)}
              onKeyDown={aoTeclar}
              placeholder={placeholder}
              disabled={disabled}
              className={classeCampo}
            />
          </div>
        </PopoverAnchor>

        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) min-w-64 gap-0 p-1"
          onOpenAutoFocus={(evento) => evento.preventDefault()}
          onInteractOutside={(evento) => {
            if (ancoraRef.current?.contains(evento.target as Node)) {
              evento.preventDefault()
            }
          }}
        >
          <CommandPrimitive.List className="max-h-64 scroll-py-1 overflow-y-auto">
            {carregando ? (
              <CommandPrimitive.Loading>
                <div className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground">
                  <LoaderCircleIcon className="size-4 animate-spin" />
                  Buscando…
                </div>
              </CommandPrimitive.Loading>
            ) : null}

            {!carregando && sugestoes.length === 0 && mensagemVazia ? (
              <div className="px-2 py-2 text-sm text-muted-foreground">
                {mensagemVazia}
              </div>
            ) : null}

            {sugestoes.map((sugestao) => (
              <CommandPrimitive.Item
                key={sugestao.valor}
                value={sugestao.valor}
                onSelect={() => escolher(sugestao)}
                className="flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <span className="truncate">{sugestao.rotulo}</span>
                {sugestao.detalhe ? (
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {sugestao.detalhe}
                  </span>
                ) : null}
              </CommandPrimitive.Item>
            ))}
          </CommandPrimitive.List>

          {rodape ? (
            <div className="mt-1 border-t px-2 pt-1.5 pb-0.5 text-xs text-muted-foreground">
              {rodape}
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    </CommandPrimitive>
  )
}

export { CampoSugestoes }
export type { Sugestao }
