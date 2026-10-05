import type { DialetoSql, TipoColunaSql } from '@/lib/sql'

type Entidade = 'pessoa' | 'empresa'

type Registro = Record<string, string>

type ColunaDados = {
  chave: string
  rotulo: string
  tipo: TipoColunaSql
  tamanho?: number
  formatar?: (valor: string) => string
}

type OpcoesGeracao = {
  entidade: Entidade
  quantidade: number
  uf: string
}

type FormatoSaida = 'tabela' | 'json' | 'csv' | 'sql'

type EstiloNome = 'camel' | 'snake'

type OpcoesSaida = {
  colunas: string[]
  comMascara: boolean
  estiloNome: EstiloNome
  dialeto: DialetoSql
  tabela: string
  comCreateTable: boolean
}

export type {
  ColunaDados,
  Entidade,
  EstiloNome,
  FormatoSaida,
  OpcoesGeracao,
  OpcoesSaida,
  Registro,
}
