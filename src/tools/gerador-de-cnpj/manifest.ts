import { Building2Icon } from 'lucide-react'

import type { ToolManifest } from '@/tools/_core/types'

const geradorDeCnpjManifest: ToolManifest = {
  slug: 'gerador-de-cnpj',
  nome: 'Gerador de CNPJ',
  descricao:
    'CNPJs válidos para teste, no formato numérico ou no novo alfanumérico, com ou sem máscara.',
  categoria: 'dev',
  tags: [
    'cnpj',
    'gerador',
    'gerar cnpj',
    'cnpj valido',
    'cnpj alfanumerico',
    'validar cnpj',
    'teste',
    'empresa',
  ],
  icone: Building2Icon,
  runtime: 'client',
}

export { geradorDeCnpjManifest }
