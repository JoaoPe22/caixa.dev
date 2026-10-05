'use client'

import { useId } from 'react'

import { Field, FieldLabel } from '@/components/ui/field'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'

type CampoQuantidadeProps = {
  valor: number
  aoMudar: (quantidade: number) => void
  opcoes?: readonly number[]
}

const QUANTIDADES = [1, 5, 10, 20, 50, 100, 500, 1000]

const CampoQuantidade = ({
  valor,
  aoMudar,
  opcoes = QUANTIDADES,
}: CampoQuantidadeProps) => {
  const id = useId()

  return (
    <Field>
      <FieldLabel htmlFor={id}>Quantidade</FieldLabel>
      <NativeSelect
        id={id}
        value={valor}
        onChange={(evento) => aoMudar(Number(evento.target.value))}
        className="w-full"
      >
        {opcoes.map((quantidade) => (
          <NativeSelectOption key={quantidade} value={quantidade}>
            {quantidade}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </Field>
  )
}

export { CampoQuantidade }
