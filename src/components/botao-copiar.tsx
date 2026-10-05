'use client'

import { CheckIcon, CopyIcon } from 'lucide-react'
import type { ComponentProps } from 'react'

import { Button } from '@/components/ui/button'
import { useCopiar } from '@/hooks/use-copiar'

type BotaoCopiarProps = Omit<
  ComponentProps<typeof Button>,
  'onClick' | 'children'
> & {
  texto: string
  rotulo?: string
}

const BotaoCopiar = ({
  texto,
  rotulo,
  type = 'button',
  ...props
}: BotaoCopiarProps) => {
  const { copiado, copiar } = useCopiar()
  const Icone = copiado ? CheckIcon : CopyIcon

  return (
    <Button type={type} onClick={() => copiar(texto)} {...props}>
      <Icone className={rotulo ? 'size-4' : 'size-3.5'} />
      {rotulo ? (copiado ? 'Copiado' : rotulo) : null}
    </Button>
  )
}

export { BotaoCopiar }
