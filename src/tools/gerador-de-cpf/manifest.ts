import { IdCardIcon } from 'lucide-react'

import type { ToolManifest } from '@/tools/_core/types'

const geradorDeCpfManifest: ToolManifest = {
  slug: 'gerador-de-cpf',
  nome: 'Gerador de CPF',
  descricao:
    'CPFs válidos para teste, com escolha do estado de emissão e com ou sem máscara.',
  categoria: 'dev',
  tags: [
    'cpf',
    'gerador',
    'gerar cpf',
    'cpf valido',
    'validar cpf',
    'teste',
    'pessoa',
  ],
  icone: IdCardIcon,
  runtime: 'client',
}

export { geradorDeCpfManifest }
