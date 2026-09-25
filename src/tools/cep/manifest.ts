import { MapPinIcon } from 'lucide-react'

import type { ToolManifest } from '@/tools/_core/types'

const cepManifest: ToolManifest = {
  slug: 'cep',
  nome: 'Consulta de CEP',
  descricao:
    'Endereço a partir do CEP, ou busque o CEP pelo nome da rua, cidade e estado.',
  categoria: 'brasil',
  tags: [
    'cep',
    'endereco',
    'endereço',
    'correios',
    'viacep',
    'ibge',
    'logradouro',
    'rua',
    'busca reversa',
  ],
  icone: MapPinIcon,
  runtime: 'bff',
  aceitaArgumento: true,
}

export { cepManifest }
