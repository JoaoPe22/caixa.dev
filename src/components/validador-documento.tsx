'use client'

import { useId, useState } from 'react'

import { Alerta } from '@/components/alerta'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type ValidadorDocumentoProps = {
  rotulo: string
  exemplo: string
  formatar: (valor: string) => string
  validar: (valor: string) => boolean
}

const ValidadorDocumento = ({
  rotulo,
  exemplo,
  formatar,
  validar,
}: ValidadorDocumentoProps) => {
  const id = useId()
  const [valor, setValor] = useState('')
  const completo = valor.length >= exemplo.length
  const valido = completo && validar(valor)

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold">Validar {rotulo}</h2>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <Field>
          <FieldLabel htmlFor={id}>{rotulo}</FieldLabel>
          <Input
            id={id}
            value={valor}
            onChange={(evento) => setValor(formatar(evento.target.value))}
            placeholder={exemplo}
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            className="max-w-56 font-mono"
          />
        </Field>

        {completo ? (
          <Alerta variante={valido ? 'sucesso' : 'erro'}>
            {valido
              ? `${rotulo} válido: os dígitos verificadores conferem.`
              : `${rotulo} inválido: os dígitos verificadores não conferem.`}
          </Alerta>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { ValidadorDocumento }
