import Link from 'next/link'

import { Button } from '@/components/ui/button'

const NotFound = () => (
  <div className="flex flex-col items-start gap-4">
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold tracking-tight">
        Essa ferramenta não existe
      </h1>
      <p className="text-sm text-muted-foreground">
        Talvez ela ainda não tenha sido construída.
      </p>
    </div>

    <Button asChild variant="outline" size="sm">
      <Link href="/">Ver todas as ferramentas</Link>
    </Button>
  </div>
)

export default NotFound
