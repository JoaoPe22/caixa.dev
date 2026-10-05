'use client'

import { useId } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'

type CaixaDeSelecaoProps = {
  rotulo: string
  marcada: boolean
  aoMudar: (marcada: boolean) => void
  className?: string
}

const CaixaDeSelecao = ({
  rotulo,
  marcada,
  aoMudar,
  className,
}: CaixaDeSelecaoProps) => {
  const id = useId()

  return (
    <Field orientation="horizontal" className={className}>
      <Checkbox
        id={id}
        checked={marcada}
        onCheckedChange={(estado) => aoMudar(estado === true)}
      />
      <FieldLabel htmlFor={id} className="font-normal">
        {rotulo}
      </FieldLabel>
    </Field>
  )
}

export { CaixaDeSelecao }
