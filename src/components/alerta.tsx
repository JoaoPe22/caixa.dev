import { cn } from 'cn'
import type { LucideIcon } from 'lucide-react'
import {
  CircleAlertIcon,
  CircleCheckIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'

type VarianteAlerta = 'erro' | 'aviso' | 'sucesso'

type AlertaProps = {
  variante?: VarianteAlerta
  className?: string
  children: ReactNode
}

const estilos: Record<
  VarianteAlerta,
  { variant: 'default' | 'destructive'; icone: LucideIcon; classe?: string }
> = {
  erro: { variant: 'destructive', icone: CircleAlertIcon },
  aviso: {
    variant: 'default',
    icone: TriangleAlertIcon,
    classe:
      'text-amber-600 *:data-[slot=alert-description]:text-amber-600/90 dark:text-amber-500 dark:*:data-[slot=alert-description]:text-amber-500/90',
  },
  sucesso: {
    variant: 'default',
    icone: CircleCheckIcon,
    classe:
      'text-emerald-600 *:data-[slot=alert-description]:text-emerald-600/90 dark:text-emerald-500 dark:*:data-[slot=alert-description]:text-emerald-500/90',
  },
}

const Alerta = ({ variante = 'erro', className, children }: AlertaProps) => {
  const { variant, icone: Icone, classe } = estilos[variante]

  return (
    <Alert role="status" variant={variant} className={cn(classe, className)}>
      <Icone />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}

export { Alerta }
export type { VarianteAlerta }
