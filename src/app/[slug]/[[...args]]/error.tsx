'use client'

import { RotateCcwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

type ToolErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

const ToolError = ({ reset }: ToolErrorProps) => (
  <div className="flex flex-col items-start gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-6">
    <div className="flex flex-col gap-1">
      <h2 className="font-semibold">Esta ferramenta falhou</h2>
      <p className="text-sm text-muted-foreground">
        O resto da caixa continua funcionando. Você pode tentar de novo.
      </p>
    </div>

    <Button variant="outline" size="sm" onClick={reset}>
      <RotateCcwIcon className="size-4" />
      Tentar de novo
    </Button>
  </div>
)

export default ToolError
