import Link from 'next/link'
import type { ReactNode } from 'react'

import { Card } from '@/components/ui/card'

type ToolCardProps = {
  slug: string
  nome: string
  descricao: string
  icone: ReactNode
}

const ToolCard = ({ slug, nome, descricao, icone }: ToolCardProps) => (
  <Link href={`/${slug}`} className="group rounded-xl">
    <Card className="h-full gap-2 p-4 transition-colors group-hover:border-foreground/25">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icone}</span>
        <h3 className="font-medium">{nome}</h3>
      </div>

      <p className="text-sm text-muted-foreground">{descricao}</p>
    </Card>
  </Link>
)

export { ToolCard }
