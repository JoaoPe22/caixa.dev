import { DatabaseIcon } from 'lucide-react'

import type { ToolManifest } from '@/tools/_core/types'

const geradorDeDadosManifest: ToolManifest = {
  slug: 'gerador-de-dados',
  nome: 'Gerador de dados de teste',
  descricao:
    'Pessoas e empresas fictícias com CPF, CNPJ, endereço e telefone coerentes, em JSON, CSV ou SQL.',
  categoria: 'dev',
  tags: [
    'dados de teste',
    'massa de dados',
    'mock',
    'fake',
    'seed',
    'fixture',
    'pessoa',
    'empresa',
    'sql',
    'insert',
    'json',
    'csv',
    'banco de dados',
  ],
  icone: DatabaseIcon,
  runtime: 'client',
}

export { geradorDeDadosManifest }
