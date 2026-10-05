import { cn } from 'cn'
import type { ComponentProps } from 'react'

import { Button } from '@/components/ui/button'

type BotaoOpcaoProps = Omit<ComponentProps<typeof Button>, 'variant'> & {
  ativo: boolean
}

const BotaoOpcao = ({
  ativo,
  className,
  type = 'button',
  ...props
}: BotaoOpcaoProps) => (
  <Button
    type={type}
    variant="outline"
    aria-pressed={ativo}
    className={cn(
      'font-normal',
      ativo &&
        'border-primary bg-primary/5 font-medium dark:border-primary dark:bg-primary/10',
      className,
    )}
    {...props}
  />
)

export { BotaoOpcao }
