import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import type { ToolCategoria } from './categorias'

type ToolRuntime = 'client' | 'bff'

type ToolManifest = {
  slug: string
  nome: string
  descricao: string
  categoria: ToolCategoria
  tags: string[]
  icone: LucideIcon
  runtime: ToolRuntime
  aceitaArgumento?: boolean
}

type ToolSearchParams = Record<string, string | string[] | undefined>

type ToolProps = {
  args: string[]
  searchParams: ToolSearchParams
}

type ToolComponent = (props: ToolProps) => Promise<ReactNode> | ReactNode

type ToolModulo = {
  default: ToolComponent
}

type ToolEntrada = {
  manifest: ToolManifest
  carregar: () => Promise<ToolModulo>
}

export type {
  ToolComponent,
  ToolEntrada,
  ToolManifest,
  ToolModulo,
  ToolProps,
  ToolRuntime,
  ToolSearchParams,
}
