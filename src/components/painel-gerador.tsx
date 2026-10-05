'use client'

import { RefreshCwIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type PainelGeradorProps = {
  opcoes: ReactNode
  resultado: ReactNode
  aoGerarNovamente: () => void
}

const PainelGerador = ({
  opcoes,
  resultado,
  aoGerarNovamente,
}: PainelGeradorProps) => (
  <div className="grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
    <Card>
      <CardContent className="flex flex-col gap-4">
        {opcoes}

        <Button type="button" onClick={aoGerarNovamente}>
          <RefreshCwIcon className="size-4" />
          Gerar novamente
        </Button>
      </CardContent>
    </Card>

    <section className="flex min-w-0 flex-col gap-3">{resultado}</section>
  </div>
)

export { PainelGerador }
