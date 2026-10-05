'use client'

import { CircleAlertIcon, RotateCcwIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

type ToolErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

const ToolError = ({ reset }: ToolErrorProps) => (
  <Alert variant="destructive">
    <CircleAlertIcon />
    <AlertTitle>Esta ferramenta falhou</AlertTitle>
    <AlertDescription className="flex flex-col items-start gap-3">
      <p>O resto da caixa continua funcionando. Você pode tentar de novo.</p>

      <Button variant="outline" size="sm" onClick={reset}>
        <RotateCcwIcon className="size-4" />
        Tentar de novo
      </Button>
    </AlertDescription>
  </Alert>
)

export default ToolError
