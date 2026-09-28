import { cn } from 'cn'
import type { ReactNode } from 'react'

type VarianteAlerta = 'erro' | 'aviso'

type AlertaProps = {
  variante?: VarianteAlerta
  className?: string
  children: ReactNode
}

const estilos: Record<VarianteAlerta, string> = {
  erro: 'rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2',
  aviso: 'text-amber-600 dark:text-amber-500',
}

const Alerta = ({ variante = 'erro', className, children }: AlertaProps) => (
  <p role="status" className={cn('text-sm', estilos[variante], className)}>
    {children}
  </p>
)

export { Alerta }
export type { VarianteAlerta }
