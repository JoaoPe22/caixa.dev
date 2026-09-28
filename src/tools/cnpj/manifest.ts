import { Building2Icon } from 'lucide-react'

import type { ToolManifest } from '@/tools/_core/types'

const cnpjManifest: ToolManifest = {
  slug: 'cnpj',
  nome: 'Consulta de CNPJ',
  descricao:
    'Dados cadastrais de empresas na Receita Federal: situação, atividades, endereço e sócios.',
  categoria: 'brasil',
  tags: [
    'cnpj',
    'empresa',
    'receita federal',
    'razao social',
    'razão social',
    'cnae',
    'socios',
    'sócios',
    'qsa',
    'mei',
    'simples nacional',
  ],
  icone: Building2Icon,
  runtime: 'bff',
  aceitaArgumento: true,
}

export { cnpjManifest }
