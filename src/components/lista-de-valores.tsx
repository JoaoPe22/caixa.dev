'use client'

import { DownloadIcon } from 'lucide-react'

import { BotaoCopiar } from '@/components/botao-copiar'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { baixarArquivo } from '@/lib/baixar-arquivo'

type ListaDeValoresProps = {
  valores: readonly string[]
  nomeArquivo: string
}

const ListaDeValores = ({ valores, nomeArquivo }: ListaDeValoresProps) => {
  const todos = valores.join('\n')

  const baixarTxt = () =>
    baixarArquivo(
      new Blob([todos], { type: 'text/plain;charset=utf-8' }),
      `${nomeArquivo}.txt`,
    )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <BotaoCopiar
          texto={todos}
          rotulo={valores.length > 1 ? 'Copiar todos' : 'Copiar'}
          variant="outline"
          size="sm"
        />
        <Button type="button" variant="outline" size="sm" onClick={baixarTxt}>
          <DownloadIcon className="size-4" />
          Baixar .txt
        </Button>
      </div>

      <ItemGroup variant="outline" className="max-h-96 overflow-y-auto">
        {valores.map((valor, indice) => (
          <Item key={`${indice}-${valor}`} role="listitem" className="py-1.5">
            <ItemContent className="min-w-0">
              <ItemTitle className="font-mono font-normal">{valor}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <BotaoCopiar
                texto={valor}
                variant="ghost"
                size="icon-sm"
                aria-label={`Copiar ${valor}`}
              />
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}

export { ListaDeValores }
