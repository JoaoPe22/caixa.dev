'use client'

import { useId } from 'react'

import { Field, FieldLabel } from '@/components/ui/field'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { ufs } from '@/shared/brasil/ufs'

type CampoUfProps = {
  valor: string
  aoMudar: (uf: string) => void
  rotulo?: string
  rotuloVazio?: string
}

const CampoUf = ({
  valor,
  aoMudar,
  rotulo = 'Estado',
  rotuloVazio = 'Selecione…',
}: CampoUfProps) => {
  const id = useId()

  return (
    <Field>
      <FieldLabel htmlFor={id}>{rotulo}</FieldLabel>
      <NativeSelect
        id={id}
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        className="w-full"
      >
        <NativeSelectOption value="">{rotuloVazio}</NativeSelectOption>
        {ufs.map((estado) => (
          <NativeSelectOption key={estado.sigla} value={estado.sigla}>
            {estado.nome} ({estado.sigla})
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </Field>
  )
}

export { CampoUf }
