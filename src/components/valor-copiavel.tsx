'use client'

import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

type ValorCopiavelProps = {
  rotulo: string
  valor: string
}

const ValorCopiavel = ({ rotulo, valor }: ValorCopiavelProps) => {
  const [copiado, setCopiado] = useState(false)

  const copiar = async () => {
    await navigator.clipboard.writeText(valor)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 1_500)
  }

  return (
    <div className="flex items-start justify-between gap-3 border-b py-2.5 last:border-b-0">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">{rotulo}</span>
        <span className="truncate font-medium">{valor}</span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="size-8 shrink-0"
        onClick={copiar}
        aria-label={`Copiar ${rotulo}`}
      >
        {copiado ? (
          <CheckIcon className="size-3.5" />
        ) : (
          <CopyIcon className="size-3.5" />
        )}
      </Button>
    </div>
  )
}

export { ValorCopiavel }
