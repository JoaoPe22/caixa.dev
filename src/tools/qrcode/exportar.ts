import { baixarArquivo } from '@/lib/baixar-arquivo'

import type { CaixaLogo, QrDesenhado } from './desenhar-qr'
import { svgParaDataUrl } from './desenhar-qr'

const carregarImagem = (origem: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const imagem = new Image()

    imagem.onload = () => resolve(imagem)
    imagem.onerror = () =>
      reject(new Error('Não foi possível carregar a imagem.'))
    imagem.src = origem
  })

const desenharContido = (
  contexto: CanvasRenderingContext2D,
  imagem: HTMLImageElement,
  caixa: CaixaLogo,
  escala: number,
) => {
  const lado = caixa.tamanho * escala
  const proporcao =
    imagem.naturalWidth > 0 && imagem.naturalHeight > 0
      ? imagem.naturalWidth / imagem.naturalHeight
      : 1
  const [largura, altura] =
    proporcao >= 1 ? [lado, lado / proporcao] : [lado * proporcao, lado]

  contexto.drawImage(
    imagem,
    caixa.x * escala + (lado - largura) / 2,
    caixa.y * escala + (lado - altura) / 2,
    largura,
    altura,
  )
}

const exportarSvg = (svg: string, nome: string) =>
  baixarArquivo(
    new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }),
    `${nome}.svg`,
  )

const exportarPng = async (
  desenhoSemLogo: QrDesenhado,
  logo: string | null,
  larguraFinal: number,
  nome: string,
) => {
  const escala = larguraFinal / desenhoSemLogo.largura
  const canvas = document.createElement('canvas')

  canvas.width = Math.round(desenhoSemLogo.largura * escala)
  canvas.height = Math.round(desenhoSemLogo.altura * escala)

  const contexto = canvas.getContext('2d')

  if (!contexto) {
    throw new Error('Canvas indisponível.')
  }

  const base = await carregarImagem(svgParaDataUrl(desenhoSemLogo.svg))

  contexto.drawImage(base, 0, 0, canvas.width, canvas.height)

  if (logo && desenhoSemLogo.caixaLogo) {
    desenharContido(
      contexto,
      await carregarImagem(logo),
      desenhoSemLogo.caixaLogo,
      escala,
    )
  }

  const arquivo = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png'),
  )

  if (!arquivo) {
    throw new Error('Não foi possível gerar o PNG.')
  }

  baixarArquivo(arquivo, `${nome}.png`)
}

export { exportarPng, exportarSvg }
