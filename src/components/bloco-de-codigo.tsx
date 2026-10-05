'use client'

import { DownloadIcon } from 'lucide-react'

import { BotaoCopiar } from '@/components/botao-copiar'
import { Button } from '@/components/ui/button'
import { baixarArquivo } from '@/lib/baixar-arquivo'

type BlocoDeCodigoProps = {
  conteudo: string
  nomeArquivo: string
  tipoMime: string
}

const BlocoDeCodigo = ({
  conteudo,
  nomeArquivo,
  tipoMime,
}: BlocoDeCodigoProps) => {
  const baixar = () =>
    baixarArquivo(
      new Blob([conteudo], { type: `${tipoMime};charset=utf-8` }),
      nomeArquivo,
    )

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <BotaoCopiar
          texto={conteudo}
          rotulo="Copiar"
          variant="outline"
          size="sm"
        />
        <Button type="button" variant="outline" size="sm" onClick={baixar}>
          <DownloadIcon className="size-4" />
          Baixar {nomeArquivo}
        </Button>
      </div>

      <pre className="max-h-[28rem] overflow-auto rounded-lg border bg-muted/40 p-3 font-mono text-xs leading-relaxed">
        {conteudo}
      </pre>
    </div>
  )
}

export { BlocoDeCodigo }
