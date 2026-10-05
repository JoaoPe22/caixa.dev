'use client'

import { BotaoCopiar } from '@/components/botao-copiar'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'

type ValorCopiavelProps = {
  rotulo: string
  valor: string
}

const ValorCopiavel = ({ rotulo, valor }: ValorCopiavelProps) => (
  <Item role="listitem" className="items-start">
    <ItemContent className="min-w-0 gap-0.5">
      <ItemDescription className="text-xs">{rotulo}</ItemDescription>
      <ItemTitle>{valor}</ItemTitle>
    </ItemContent>

    <ItemActions>
      <BotaoCopiar
        texto={valor}
        variant="ghost"
        size="icon"
        className="size-8 shrink-0"
        aria-label={`Copiar ${rotulo}`}
      />
    </ItemActions>
  </Item>
)

export { ValorCopiavel }
