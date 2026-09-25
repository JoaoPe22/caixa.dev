'use client'

import { SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type PaletteItem = {
  slug: string
  nome: string
  descricao: string
  tags: string[]
  icone: ReactNode
  aceitaArgumento: boolean
}

type CommandPaletteProps = {
  itens: PaletteItem[]
}

const separarBusca = (busca: string) => {
  const partes = busca.trim().split(/\s+/)

  return {
    termo: partes[0] ?? '',
    argumento: partes.slice(1).join(''),
  }
}

const CommandPalette = ({ itens }: CommandPaletteProps) => {
  const [aberto, setAberto] = useState(false)
  const [busca, setBusca] = useState('')
  const [selecionado, setSelecionado] = useState('')
  const router = useRouter()

  useEffect(() => {
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === 'k' && (evento.metaKey || evento.ctrlKey)) {
        evento.preventDefault()
        setAberto((atual) => !atual)
      }
    }

    document.addEventListener('keydown', aoTeclar)

    return () => document.removeEventListener('keydown', aoTeclar)
  }, [])

  const { termo, argumento } = separarBusca(busca)

  const filtrados = useMemo(() => {
    const alvo = termo.toLowerCase()

    if (!alvo) {
      return itens
    }

    return itens.filter((item) =>
      [item.nome, item.slug, ...item.tags].some((campo) =>
        campo.toLowerCase().includes(alvo),
      ),
    )
  }, [itens, termo])

  const selecionadoValido = filtrados.some((item) => item.slug === selecionado)
    ? selecionado
    : (filtrados[0]?.slug ?? '')

  const navegar = (item: PaletteItem) => {
    const destino =
      argumento && item.aceitaArgumento
        ? `/${item.slug}/${encodeURIComponent(argumento)}`
        : `/${item.slug}`

    setAberto(false)
    setBusca('')
    router.push(destino)
  }

  const aoTeclarNoInput = (evento: ReactKeyboardEvent<HTMLInputElement>) => {
    if (evento.key !== 'Enter') {
      return
    }

    const alvo =
      filtrados.find((item) => item.slug === selecionadoValido) ?? filtrados[0]

    if (!alvo) {
      return
    }

    evento.preventDefault()
    navegar(alvo)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setAberto(true)}
        className="gap-2 text-muted-foreground"
      >
        <SearchIcon className="size-4" />
        <span className="hidden sm:inline">Buscar ferramenta</span>
      </Button>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogHeader className="sr-only">
          <DialogTitle>Buscar ferramenta</DialogTitle>
          <DialogDescription>
            Digite o nome de uma ferramenta. Você pode já informar o valor, como
            em &quot;cep 01310100&quot;.
          </DialogDescription>
        </DialogHeader>

        <DialogContent className="overflow-hidden p-0" showCloseButton={false}>
          <Command
            shouldFilter={false}
            value={selecionadoValido}
            onValueChange={setSelecionado}
          >
            <CommandInput
              value={busca}
              onValueChange={setBusca}
              onKeyDownCapture={aoTeclarNoInput}
              placeholder="Buscar ferramenta…  ex: cep 01310100"
            />

            <CommandList>
              <CommandEmpty>Nenhuma ferramenta encontrada.</CommandEmpty>

              <CommandGroup heading="Ferramentas">
                {filtrados.map((item) => (
                  <CommandItem
                    key={item.slug}
                    value={item.slug}
                    onSelect={() => navegar(item)}
                  >
                    {item.icone}

                    <span className="font-medium">{item.nome}</span>

                    {argumento && item.aceitaArgumento ? (
                      <span className="ml-auto font-mono text-xs text-muted-foreground">
                        {argumento}
                      </span>
                    ) : (
                      <span className="ml-auto truncate text-xs text-muted-foreground">
                        {item.descricao}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { CommandPalette }
export type { PaletteItem }
