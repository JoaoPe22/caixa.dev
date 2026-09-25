'use client'

import { cn } from 'cn'
import { ImageUpIcon, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import type { ChangeEvent } from 'react'
import { useMemo, useRef, useState } from 'react'
import { encode } from 'uqr'

import { Campo } from '@/components/campo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import type {
  EstiloCantos,
  EstiloPontos,
  Moldura,
  OpcoesDesenho,
} from './desenhar-qr'
import { desenharQr, svgParaDataUrl } from './desenhar-qr'

type PainelDesignProps = {
  design: OpcoesDesenho
  atualizar: (parcial: Partial<OpcoesDesenho>) => void
}

type OpcaoVisualProps = {
  rotulo: string
  imagem: string
  ativo: boolean
  aoEscolher: () => void
}

const TIPOS_DE_LOGO = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
const LIMITE_LOGO_BYTES = 1024 * 1024
const LIMITE_TEXTO_MOLDURA = 20

const molduras: { id: Moldura; rotulo: string }[] = [
  { id: 'nenhuma', rotulo: 'Sem moldura' },
  { id: 'faixa', rotulo: 'Faixa' },
  { id: 'borda', rotulo: 'Borda' },
  { id: 'balao', rotulo: 'Balão' },
]

const estilosDePonto: { id: EstiloPontos; rotulo: string }[] = [
  { id: 'quadrado', rotulo: 'Quadrado' },
  { id: 'redondo', rotulo: 'Redondo' },
  { id: 'arredondado', rotulo: 'Arredondado' },
]

const estilosDeCanto: { id: EstiloCantos; rotulo: string }[] = [
  { id: 'quadrado', rotulo: 'Quadrado' },
  { id: 'arredondado', rotulo: 'Arredondado' },
  { id: 'circulo', rotulo: 'Círculo' },
]

const matrizDeAmostra = encode('caixa.dev', { border: 0 })

const OpcaoVisual = ({
  rotulo,
  imagem,
  ativo,
  aoEscolher,
}: OpcaoVisualProps) => (
  <button
    type="button"
    aria-pressed={ativo}
    onClick={aoEscolher}
    className={cn(
      'flex flex-col items-center gap-1.5 rounded-lg border p-2 text-xs transition-colors hover:bg-muted',
      ativo && 'border-primary bg-primary/5 ring-2 ring-primary/30',
    )}
  >
    <Image
      src={imagem}
      alt=""
      width={64}
      height={64}
      unoptimized
      className="size-16 object-contain"
    />
    {rotulo}
  </button>
)

const SeletorDeCor = ({
  rotulo,
  valor,
  aoMudar,
  desabilitado = false,
}: {
  rotulo: string
  valor: string
  aoMudar: (cor: string) => void
  desabilitado?: boolean
}) => (
  <Campo rotulo={rotulo}>
    <div className="flex items-center gap-2">
      <Input
        type="color"
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        disabled={desabilitado}
        className="h-9 w-14 cursor-pointer p-1"
      />
      <span className="font-mono text-xs text-muted-foreground uppercase">
        {valor}
      </span>
    </div>
  </Campo>
)

const PainelDesign = ({ design, atualizar }: PainelDesignProps) => {
  const [erroLogo, setErroLogo] = useState<string | null>(null)
  const seletorDeArquivo = useRef<HTMLInputElement>(null)

  const miniatura = useMemo(
    () => (parcial: Partial<OpcoesDesenho>) =>
      svgParaDataUrl(
        desenharQr(matrizDeAmostra, { ...design, logo: null, ...parcial }).svg,
      ),
    [design],
  )

  const aoEscolherLogo = (evento: ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0]

    evento.target.value = ''

    if (!arquivo) {
      return
    }

    if (!TIPOS_DE_LOGO.includes(arquivo.type)) {
      setErroLogo('Use uma imagem PNG, JPG, WEBP ou SVG.')
      return
    }

    if (arquivo.size > LIMITE_LOGO_BYTES) {
      setErroLogo('A imagem precisa ter até 1 MB.')
      return
    }

    const leitor = new FileReader()

    leitor.onload = () => {
      if (typeof leitor.result === 'string') {
        setErroLogo(null)
        atualizar({ logo: leitor.result })
      }
    }
    leitor.onerror = () => setErroLogo('Não foi possível ler a imagem.')
    leitor.readAsDataURL(arquivo)
  }

  return (
    <Tabs defaultValue="moldura">
      <TabsList>
        <TabsTrigger value="moldura">Moldura</TabsTrigger>
        <TabsTrigger value="formato">Formato</TabsTrigger>
        <TabsTrigger value="cores">Cores</TabsTrigger>
        <TabsTrigger value="logo">Logo</TabsTrigger>
      </TabsList>

      <TabsContent value="moldura" className="flex flex-col gap-4 pt-2">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {molduras.map((moldura) => (
            <OpcaoVisual
              key={moldura.id}
              rotulo={moldura.rotulo}
              imagem={miniatura({ moldura: moldura.id })}
              ativo={design.moldura === moldura.id}
              aoEscolher={() => atualizar({ moldura: moldura.id })}
            />
          ))}
        </div>

        {design.moldura !== 'nenhuma' ? (
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
            <Campo
              rotulo="Texto da moldura"
              dica={`até ${LIMITE_TEXTO_MOLDURA}`}
            >
              <Input
                value={design.textoMoldura}
                onChange={(evento) =>
                  atualizar({ textoMoldura: evento.target.value })
                }
                maxLength={LIMITE_TEXTO_MOLDURA}
              />
            </Campo>
            <SeletorDeCor
              rotulo="Cor da moldura"
              valor={design.corMoldura}
              aoMudar={(cor) => atualizar({ corMoldura: cor })}
            />
          </div>
        ) : null}
      </TabsContent>

      <TabsContent value="formato" className="flex flex-col gap-4 pt-2">
        <Campo rotulo="Pontos">
          <div className="grid grid-cols-3 gap-2">
            {estilosDePonto.map((estilo) => (
              <OpcaoVisual
                key={estilo.id}
                rotulo={estilo.rotulo}
                imagem={miniatura({ pontos: estilo.id, moldura: 'nenhuma' })}
                ativo={design.pontos === estilo.id}
                aoEscolher={() => atualizar({ pontos: estilo.id })}
              />
            ))}
          </div>
        </Campo>

        <Campo rotulo="Cantos">
          <div className="grid grid-cols-3 gap-2">
            {estilosDeCanto.map((estilo) => (
              <OpcaoVisual
                key={estilo.id}
                rotulo={estilo.rotulo}
                imagem={miniatura({ cantos: estilo.id, moldura: 'nenhuma' })}
                ativo={design.cantos === estilo.id}
                aoEscolher={() => atualizar({ cantos: estilo.id })}
              />
            ))}
          </div>
        </Campo>
      </TabsContent>

      <TabsContent value="cores" className="flex flex-col gap-4 pt-2">
        <div className="flex flex-wrap gap-6">
          <SeletorDeCor
            rotulo="Cor do QR"
            valor={design.corFrente}
            aoMudar={(cor) => atualizar({ corFrente: cor })}
          />
          <SeletorDeCor
            rotulo="Cor do fundo"
            valor={design.corFundo}
            aoMudar={(cor) => atualizar({ corFundo: cor })}
            desabilitado={design.fundoTransparente}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={design.fundoTransparente}
            onChange={(evento) =>
              atualizar({ fundoTransparente: evento.target.checked })
            }
            className="size-4 accent-primary"
          />
          Fundo transparente
        </label>
      </TabsContent>

      <TabsContent value="logo" className="flex flex-col gap-4 pt-2">
        <input
          ref={seletorDeArquivo}
          type="file"
          accept={TIPOS_DE_LOGO.join(',')}
          onChange={aoEscolherLogo}
          className="hidden"
        />

        <div className="flex flex-wrap items-center gap-3">
          {design.logo ? (
            <Image
              src={design.logo}
              alt="Logo escolhido"
              width={48}
              height={48}
              unoptimized
              className="size-12 rounded-md border object-contain p-1"
            />
          ) : null}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => seletorDeArquivo.current?.click()}
          >
            <ImageUpIcon className="size-4" />
            {design.logo ? 'Trocar imagem' : 'Enviar imagem'}
          </Button>

          {design.logo ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => atualizar({ logo: null })}
            >
              <Trash2Icon className="size-4" />
              Remover
            </Button>
          ) : null}
        </div>

        {design.logo ? (
          <Campo
            rotulo="Tamanho do logo"
            dica={`${Math.round(design.tamanhoLogo * 100)}% da largura`}
          >
            <input
              type="range"
              min={0.15}
              max={0.25}
              step={0.01}
              value={design.tamanhoLogo}
              onChange={(evento) =>
                atualizar({ tamanhoLogo: Number(evento.target.value) })
              }
              className="w-full max-w-64 accent-primary"
            />
          </Campo>
        ) : null}

        {erroLogo ? (
          <p role="status" className="text-sm text-destructive">
            {erroLogo}
          </p>
        ) : null}

        <p className="text-xs text-muted-foreground">
          A imagem não sai do seu navegador. Com logo, o QR usa a correção de
          erro máxima para continuar legível.
        </p>
      </TabsContent>
    </Tabs>
  )
}

export { PainelDesign }
