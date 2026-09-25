'use client'

import { cn } from 'cn'
import { CheckIcon, CopyIcon, DownloadIcon } from 'lucide-react'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { useDeferredValue, useMemo, useState } from 'react'
import { encode } from 'uqr'

import { Campo } from '@/components/campo'
import { Button } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'

import { avisosDeLeitura } from './avisos-leitura'
import { type Atualizar, CamposConteudo } from './campos-conteudo'
import type { MatrizQr, OpcoesDesenho } from './desenhar-qr'
import { desenharQr, opcoesPadrao, svgParaDataUrl } from './desenhar-qr'
import { exportarPng, exportarSvg } from './exportar'
import { montarPayload } from './montar-payload'
import { PainelDesign } from './painel-design'
import type { DadosConteudo, TipoConteudo } from './tipos-conteudo'
import { dadosIniciais, tiposDeConteudo } from './tipos-conteudo'

type Codificacao = { ok: true; matriz: MatrizQr } | { ok: false; erro: string }

const TAMANHOS_PNG = [512, 1024, 2048]
const AMOSTRA = 'https://caixa.dev'

const matrizDeAmostra = encode(AMOSTRA, { border: 0 })

const codificar = (payload: string, comLogo: boolean): Codificacao => {
  try {
    return {
      ok: true,
      matriz: encode(payload, {
        ecc: comLogo ? 'H' : 'M',
        boostEcc: true,
        border: 0,
      }),
    }
  } catch {
    return {
      ok: false,
      erro: 'O conteúdo é grande demais para caber em um QR Code.',
    }
  }
}

const Etapa = ({
  numero,
  titulo,
  children,
}: {
  numero: number
  titulo: string
  children: ReactNode
}) => (
  <section className="flex flex-col gap-4 rounded-xl border p-4 sm:p-5">
    <h2 className="flex items-center gap-2 font-semibold">
      <span className="flex size-6 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">
        {numero}
      </span>
      {titulo}
    </h2>
    {children}
  </section>
)

const GeradorQr = () => {
  const [tipo, setTipo] = useState<TipoConteudo>('link')
  const [dados, setDados] = useState<DadosConteudo>(dadosIniciais)
  const [design, setDesign] = useState<OpcoesDesenho>(opcoesPadrao)
  const [tamanhoPng, setTamanhoPng] = useState(1024)
  const [gerandoPng, setGerandoPng] = useState(false)
  const [erroDownload, setErroDownload] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)

  const atualizarDados: Atualizar = (alvo, parcial) =>
    setDados((anterior) => ({
      ...anterior,
      [alvo]: { ...anterior[alvo], ...parcial },
    }))

  const atualizarDesign = (parcial: Partial<OpcoesDesenho>) =>
    setDesign((anterior) => ({ ...anterior, ...parcial }))

  const resultado = useMemo(() => montarPayload(tipo, dados), [tipo, dados])
  const resultadoAdiado = useDeferredValue(resultado)
  const designAdiado = useDeferredValue(design)
  const comLogoAdiado = designAdiado.logo !== null

  const codificacao = useMemo(
    () =>
      resultadoAdiado.ok
        ? codificar(resultadoAdiado.payload, comLogoAdiado)
        : null,
    [resultadoAdiado, comLogoAdiado],
  )

  const desenho = useMemo(
    () =>
      desenharQr(
        codificacao?.ok ? codificacao.matriz : matrizDeAmostra,
        designAdiado,
      ),
    [codificacao, designAdiado],
  )

  const pronto = resultado.ok && codificacao?.ok === true
  const erro = !resultado.ok
    ? resultado.erro
    : codificacao && !codificacao.ok
      ? codificacao.erro
      : null
  const avisos = avisosDeLeitura(design)
  const nomeArquivo = `qrcode-${tipo}`

  const codificacaoAtual = () =>
    resultado.ok ? codificar(resultado.payload, design.logo !== null) : null

  const baixarSvg = () => {
    const atual = codificacaoAtual()

    if (atual?.ok) {
      exportarSvg(desenharQr(atual.matriz, design).svg, nomeArquivo)
    }
  }

  const baixarPng = async () => {
    const atual = codificacaoAtual()

    if (!atual?.ok) {
      return
    }

    setGerandoPng(true)
    setErroDownload(null)

    try {
      await exportarPng(
        desenharQr(atual.matriz, design, false),
        design.logo,
        tamanhoPng,
        nomeArquivo,
      )
    } catch {
      setErroDownload('Não foi possível gerar o PNG. Tente baixar em SVG.')
    } finally {
      setGerandoPng(false)
    }
  }

  const copiarPix = async () => {
    if (!resultado.ok) {
      return
    }

    await navigator.clipboard.writeText(resultado.payload)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 1_500)
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex flex-col gap-6">
        <div
          role="group"
          aria-label="Tipo de conteúdo"
          className="grid grid-cols-2 gap-2 rounded-xl border p-3 sm:grid-cols-5"
        >
          {tiposDeConteudo.map(({ id, rotulo, icone: Icone }) => (
            <button
              key={id}
              type="button"
              aria-pressed={tipo === id}
              onClick={() => setTipo(id)}
              className={cn(
                'flex items-center justify-center gap-2 rounded-lg border border-transparent px-2 py-2 text-sm transition-colors hover:bg-muted',
                tipo === id && 'border-primary bg-primary/5 font-medium',
              )}
            >
              <Icone className="size-4 shrink-0" />
              <span className="truncate">{rotulo}</span>
            </button>
          ))}
        </div>

        <Etapa numero={1} titulo="Conteúdo">
          <CamposConteudo
            tipo={tipo}
            dados={dados}
            atualizar={atualizarDados}
          />

          {erro ? (
            <p
              role="status"
              className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm"
            >
              {erro}
            </p>
          ) : null}
        </Etapa>

        <Etapa numero={2} titulo="Design">
          <PainelDesign design={design} atualizar={atualizarDesign} />
        </Etapa>
      </div>

      <aside className="lg:sticky lg:top-6">
        <Etapa numero={3} titulo="Baixar">
          <div className="flex items-center justify-center rounded-lg border bg-muted/40 p-4">
            <Image
              src={svgParaDataUrl(desenho.svg)}
              alt={
                pronto
                  ? 'Pré-visualização do QR Code'
                  : 'Exemplo de QR Code: preencha o conteúdo para gerar o seu'
              }
              width={desenho.largura}
              height={desenho.altura}
              unoptimized
              className={cn(
                'h-auto w-full max-w-64 transition-opacity',
                !pronto && 'opacity-25',
              )}
            />
          </div>

          {avisos.map((aviso) => (
            <p
              key={aviso}
              role="status"
              className="text-sm text-amber-600 dark:text-amber-500"
            >
              {aviso}
            </p>
          ))}

          {tipo === 'pix' && resultado.ok ? (
            <div className="flex flex-col gap-2 rounded-lg border p-3">
              <span className="text-xs font-medium text-muted-foreground uppercase">
                Pix copia e cola
              </span>
              <p className="font-mono text-xs break-all">{resultado.payload}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copiarPix}
              >
                {copiado ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
                {copiado ? 'Copiado' : 'Copiar código'}
              </Button>
            </div>
          ) : null}

          <Campo rotulo="Tamanho do PNG">
            <NativeSelect
              value={tamanhoPng}
              onChange={(evento) => setTamanhoPng(Number(evento.target.value))}
              className="w-full"
            >
              {TAMANHOS_PNG.map((tamanho) => (
                <NativeSelectOption key={tamanho} value={tamanho}>
                  {tamanho} × {tamanho} px
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Campo>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              onClick={baixarPng}
              disabled={!pronto || gerandoPng}
            >
              <DownloadIcon className="size-4" />
              {gerandoPng ? 'Gerando…' : 'PNG'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={baixarSvg}
              disabled={!pronto}
            >
              <DownloadIcon className="size-4" />
              SVG
            </Button>
          </div>

          {erroDownload ? (
            <p role="status" className="text-sm text-destructive">
              {erroDownload}
            </p>
          ) : null}

          {!pronto ? (
            <p className="text-xs text-muted-foreground">
              Preencha o conteúdo para liberar o download.
            </p>
          ) : null}
        </Etapa>
      </aside>
    </div>
  )
}

export { GeradorQr }
