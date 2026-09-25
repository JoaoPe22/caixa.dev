import { cn } from 'cn'
import type { ReactNode } from 'react'

type CampoProps = {
  rotulo: string
  dica?: string
  className?: string
  children: ReactNode
}

const Campo = ({ rotulo, dica, className, children }: CampoProps) => (
  <label className={cn('flex flex-col gap-1.5', className)}>
    <span className="text-xs font-medium text-muted-foreground uppercase">
      {rotulo}
      {dica ? <span className="normal-case"> ({dica})</span> : null}
    </span>
    {children}
  </label>
)

export { Campo }
