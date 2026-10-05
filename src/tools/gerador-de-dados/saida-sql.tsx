'use client'

import { CaixaDeSelecao } from '@/components/caixa-de-selecao'
import { Campo } from '@/components/campo'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import type { DialetoSql } from '@/lib/sql'
import { dialetosSql } from '@/lib/sql'

import type { OpcoesSaida } from './tipos'

type SaidaSqlProps = {
  opcoes: OpcoesSaida
  atualizar: (parcial: Partial<OpcoesSaida>) => void
}

const SaidaSql = ({ opcoes, atualizar }: SaidaSqlProps) => (
  <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
    <Campo rotulo="Banco">
      <NativeSelect
        value={opcoes.dialeto}
        onChange={(evento) =>
          atualizar({ dialeto: evento.target.value as DialetoSql })
        }
        className="w-full"
      >
        {dialetosSql.map(({ id, rotulo }) => (
          <NativeSelectOption key={id} value={id}>
            {rotulo}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </Campo>

    <Campo rotulo="Tabela">
      <Input
        value={opcoes.tabela}
        onChange={(evento) => atualizar({ tabela: evento.target.value })}
        autoComplete="off"
        spellCheck={false}
        className="font-mono"
      />
    </Campo>

    <CaixaDeSelecao
      rotulo="Incluir CREATE TABLE"
      marcada={opcoes.comCreateTable}
      aoMudar={(comCreateTable) => atualizar({ comCreateTable })}
      className="h-8"
    />
  </div>
)

export { SaidaSql }
