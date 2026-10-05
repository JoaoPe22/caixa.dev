'use client'

import { cn } from 'cn'
import type { ReactElement, ReactNode } from 'react'
import { cloneElement, isValidElement, useId } from 'react'

import { Field, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'

type CampoProps = {
  rotulo: string
  dica?: string
  className?: string
  children: ReactElement<{ id?: string }> | ((id: string) => ReactNode)
}

type GrupoDeCamposProps = {
  rotulo: string
  className?: string
  children: ReactNode
}

const classeRotulo = 'text-xs font-medium text-muted-foreground uppercase'

const Campo = ({ rotulo, dica, className, children }: CampoProps) => {
  const idGerado = useId()
  const id =
    (isValidElement(children) ? children.props.id : undefined) ?? idGerado

  return (
    <Field className={cn('gap-1.5', className)}>
      <FieldLabel htmlFor={id} className={cn(classeRotulo, 'gap-0')}>
        {rotulo}
        {dica ? <span className="normal-case">&nbsp;({dica})</span> : null}
      </FieldLabel>
      {typeof children === 'function'
        ? children(id)
        : cloneElement(children, { id })}
    </Field>
  )
}

const GrupoDeCampos = ({ rotulo, className, children }: GrupoDeCamposProps) => (
  <FieldSet className={cn('gap-2', className)}>
    <FieldLegend
      variant="label"
      className={cn(classeRotulo, 'mb-0 data-[variant=label]:text-xs')}
    >
      {rotulo}
    </FieldLegend>
    {children}
  </FieldSet>
)

export { Campo, GrupoDeCampos }
