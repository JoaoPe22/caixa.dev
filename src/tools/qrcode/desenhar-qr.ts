import { QrCodeDataType } from 'uqr'

import { corHexValida, luminancia } from '@/lib/contraste'

type EstiloPontos = 'quadrado' | 'redondo' | 'arredondado'
type EstiloCantos = 'quadrado' | 'arredondado' | 'circulo'
type Moldura = 'nenhuma' | 'faixa' | 'borda' | 'balao'

type MatrizQr = {
  size: number
  data: boolean[][]
  types: QrCodeDataType[][]
}

type OpcoesDesenho = {
  pontos: EstiloPontos
  cantos: EstiloCantos
  corFrente: string
  corFundo: string
  fundoTransparente: boolean
  moldura: Moldura
  textoMoldura: string
  corMoldura: string
  logo: string | null
  tamanhoLogo: number
}

type CaixaLogo = {
  x: number
  y: number
  tamanho: number
}

type QrDesenhado = {
  svg: string
  largura: number
  altura: number
  caixaLogo: CaixaLogo | null
}

const MODULO = 10
const ZONA_SILENCIOSA = 3
const TAMANHO_CANTO = 7
const FONTE = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"

const opcoesPadrao: OpcoesDesenho = {
  pontos: 'quadrado',
  cantos: 'quadrado',
  corFrente: '#111111',
  corFundo: '#ffffff',
  fundoTransparente: false,
  moldura: 'nenhuma',
  textoMoldura: 'ESCANEIE',
  corMoldura: '#111111',
  logo: null,
  tamanhoLogo: 0.2,
}

const arredondar = (valor: number) => Math.round(valor * 100) / 100

const escaparXml = (texto: string) =>
  texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const corSegura = (cor: string, reserva: string) =>
  corHexValida(cor) ? cor : reserva

const corDoTextoSobre = (fundo: string) =>
  luminancia(fundo) > 0.45 ? '#111111' : '#ffffff'

const retangulo = (
  x: number,
  y: number,
  largura: number,
  altura: number,
  raio = 0,
) => {
  const [px, py, w, h] = [x, y, largura, altura].map(arredondar)
  const r = arredondar(Math.min(raio, largura / 2, altura / 2))

  if (r <= 0) {
    return `M${px} ${py}h${w}v${h}h${-w}z`
  }

  const retoH = arredondar(w - 2 * r)
  const retoV = arredondar(h - 2 * r)

  return [
    `M${arredondar(px + r)} ${py}`,
    `h${retoH}a${r} ${r} 0 0 1 ${r} ${r}`,
    `v${retoV}a${r} ${r} 0 0 1 ${-r} ${r}`,
    `h${-retoH}a${r} ${r} 0 0 1 ${-r} ${-r}`,
    `v${-retoV}a${r} ${r} 0 0 1 ${r} ${-r}z`,
  ].join('')
}

const circulo = (cx: number, cy: number, raio: number) => {
  const [x, y, r] = [cx - raio, cy, raio].map(arredondar)

  return `M${x} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`
}

const formaDoPonto = (estilo: EstiloPontos, x: number, y: number) => {
  switch (estilo) {
    case 'redondo':
      return circulo(x + MODULO / 2, y + MODULO / 2, MODULO / 2)
    case 'arredondado':
      return retangulo(x, y, MODULO, MODULO, MODULO * 0.3)
    default:
      return retangulo(x, y, MODULO, MODULO)
  }
}

const formaDoCanto = (estilo: EstiloCantos, x: number, y: number) => {
  const externo = TAMANHO_CANTO * MODULO
  const vazado = (TAMANHO_CANTO - 2) * MODULO
  const interno = (TAMANHO_CANTO - 4) * MODULO

  if (estilo === 'circulo') {
    const centro = externo / 2

    return {
      anel:
        circulo(x + centro, y + centro, externo / 2) +
        circulo(x + centro, y + centro, vazado / 2),
      miolo: circulo(x + centro, y + centro, interno / 2),
    }
  }

  const [raioExterno, raioVazado, raioInterno] =
    estilo === 'arredondado' ? [2.2, 1.4, 0.9] : [0, 0, 0]

  return {
    anel:
      retangulo(x, y, externo, externo, raioExterno * MODULO) +
      retangulo(x + MODULO, y + MODULO, vazado, vazado, raioVazado * MODULO),
    miolo: retangulo(
      x + 2 * MODULO,
      y + 2 * MODULO,
      interno,
      interno,
      raioInterno * MODULO,
    ),
  }
}

const dentroDeCanto = (linha: number, coluna: number, tamanho: number) => {
  const limite = tamanho - TAMANHO_CANTO

  return (
    (linha < TAMANHO_CANTO && coluna < TAMANHO_CANTO) ||
    (linha < TAMANHO_CANTO && coluna >= limite) ||
    (linha >= limite && coluna < TAMANHO_CANTO)
  )
}

const tamanhoImpar = (valor: number) => {
  const inteiro = Math.max(1, Math.round(valor))

  return inteiro % 2 === 0 ? inteiro + 1 : inteiro
}

const texto = (
  conteudo: string,
  x: number,
  y: number,
  larguraMaxima: number,
  alturaBase: number,
  cor: string,
) => {
  const tamanhoBase = alturaBase * 0.42
  const larguraEstimada = conteudo.length * tamanhoBase * 0.62
  const tamanho =
    larguraEstimada > larguraMaxima
      ? larguraMaxima / (conteudo.length * 0.62)
      : tamanhoBase

  return `<text x="${arredondar(x)}" y="${arredondar(y)}" fill="${cor}" font-family="${FONTE}" font-size="${arredondar(tamanho)}" font-weight="700" letter-spacing="1" text-anchor="middle" dominant-baseline="central">${escaparXml(conteudo)}</text>`
}

const desenharQr = (
  matriz: MatrizQr,
  opcoes: OpcoesDesenho,
  incluirLogo = true,
): QrDesenhado => {
  const corFrente = corSegura(opcoes.corFrente, opcoesPadrao.corFrente)
  const corFundo = corSegura(opcoes.corFundo, opcoesPadrao.corFundo)
  const corMoldura = corSegura(opcoes.corMoldura, opcoesPadrao.corMoldura)
  const preenchimentoFundo = opcoes.fundoTransparente ? 'none' : corFundo

  const n = matriz.size
  const ladoQr = (n + ZONA_SILENCIOSA * 2) * MODULO
  const espessura = arredondar(ladoQr * 0.04)
  const faixa = arredondar(ladoQr * 0.2)
  const rotulo = opcoes.textoMoldura.trim()

  const layout = {
    nenhuma: { largura: ladoQr, altura: ladoQr, qrX: 0, qrY: 0 },
    faixa: {
      largura: ladoQr + 2 * espessura,
      altura: ladoQr + 2 * espessura + faixa,
      qrX: espessura,
      qrY: espessura,
    },
    borda: {
      largura: ladoQr + 2 * espessura,
      altura: ladoQr + 2 * espessura + faixa,
      qrX: espessura,
      qrY: espessura,
    },
    balao: { largura: ladoQr, altura: ladoQr + faixa, qrX: 0, qrY: faixa },
  }[opcoes.moldura]

  const { largura, altura, qrX, qrY } = layout
  const origemX = qrX + ZONA_SILENCIOSA * MODULO
  const origemY = qrY + ZONA_SILENCIOSA * MODULO

  const ladoLogo =
    opcoes.logo !== null ? tamanhoImpar(n * opcoes.tamanhoLogo) : 0
  const inicioLogo = Math.floor((n - ladoLogo) / 2)
  const dentroDoLogo = (linha: number, coluna: number) =>
    ladoLogo > 0 &&
    linha >= inicioLogo - 1 &&
    linha <= inicioLogo + ladoLogo &&
    coluna >= inicioLogo - 1 &&
    coluna <= inicioLogo + ladoLogo

  const pontos: string[] = []

  matriz.data.forEach((linhaDaMatriz, linha) => {
    linhaDaMatriz.forEach((escuro, coluna) => {
      if (
        escuro &&
        !dentroDeCanto(linha, coluna, n) &&
        !dentroDoLogo(linha, coluna)
      ) {
        const alinhamento =
          matriz.types[linha]?.[coluna] === QrCodeDataType.Alignment

        pontos.push(
          formaDoPonto(
            alinhamento ? 'quadrado' : opcoes.pontos,
            origemX + coluna * MODULO,
            origemY + linha * MODULO,
          ),
        )
      }
    })
  })

  const cantos = [
    [0, 0],
    [(n - TAMANHO_CANTO) * MODULO, 0],
    [0, (n - TAMANHO_CANTO) * MODULO],
  ].map(([dx, dy]) => formaDoCanto(opcoes.cantos, origemX + dx, origemY + dy))

  const partes: string[] = []

  if (opcoes.moldura === 'faixa') {
    partes.push(
      `<path d="${retangulo(0, 0, largura, altura, espessura * 2)}" fill="${corMoldura}"/>`,
      `<path d="${retangulo(qrX, qrY, ladoQr, ladoQr, espessura)}" fill="${preenchimentoFundo}"/>`,
    )

    if (rotulo) {
      partes.push(
        texto(
          rotulo,
          largura / 2,
          qrY + ladoQr + faixa / 2,
          ladoQr * 0.9,
          faixa,
          corDoTextoSobre(corMoldura),
        ),
      )
    }
  }

  if (opcoes.moldura === 'borda') {
    partes.push(
      `<path d="${retangulo(0, 0, largura, altura, espessura * 2)}" fill="${preenchimentoFundo}"/>`,
      `<path d="${retangulo(espessura / 2, espessura / 2, ladoQr + espessura, ladoQr + espessura, espessura * 2)}" fill="none" stroke="${corMoldura}" stroke-width="${espessura}"/>`,
    )

    if (rotulo) {
      partes.push(
        texto(
          rotulo,
          largura / 2,
          ladoQr + 2 * espessura + faixa / 2,
          ladoQr * 0.9,
          faixa,
          corMoldura,
        ),
      )
    }
  }

  if (opcoes.moldura === 'balao') {
    const alturaBalao = faixa * 0.72
    const ponta = faixa * 0.2
    const centroX = largura / 2

    partes.push(
      `<path d="${retangulo(0, qrY, ladoQr, ladoQr, espessura)}" fill="${preenchimentoFundo}"/>`,
      `<path d="${retangulo(ladoQr * 0.12, 0, ladoQr * 0.76, alturaBalao, alturaBalao / 2)}M${arredondar(centroX - ponta)} ${arredondar(alturaBalao - 1)}L${arredondar(centroX)} ${arredondar(alturaBalao + ponta)}L${arredondar(centroX + ponta)} ${arredondar(alturaBalao - 1)}z" fill="${corMoldura}"/>`,
    )

    if (rotulo) {
      partes.push(
        texto(
          rotulo,
          centroX,
          alturaBalao / 2,
          ladoQr * 0.68,
          alturaBalao,
          corDoTextoSobre(corMoldura),
        ),
      )
    }
  }

  if (opcoes.moldura === 'nenhuma') {
    partes.push(
      `<path d="${retangulo(0, 0, ladoQr, ladoQr)}" fill="${preenchimentoFundo}"/>`,
    )
  }

  partes.push(
    `<path d="${pontos.join('')}" fill="${corFrente}"${opcoes.pontos === 'quadrado' ? ' shape-rendering="crispEdges"' : ''}/>`,
    `<path d="${cantos.map((canto) => canto.anel).join('')}" fill="${corFrente}" fill-rule="evenodd"/>`,
    `<path d="${cantos.map((canto) => canto.miolo).join('')}" fill="${corFrente}"/>`,
  )

  const caixaLogo =
    ladoLogo > 0
      ? {
          x: arredondar(origemX + inicioLogo * MODULO),
          y: arredondar(origemY + inicioLogo * MODULO),
          tamanho: ladoLogo * MODULO,
        }
      : null

  if (caixaLogo && opcoes.logo) {
    if (!opcoes.fundoTransparente) {
      partes.push(
        `<path d="${retangulo(caixaLogo.x - MODULO, caixaLogo.y - MODULO, caixaLogo.tamanho + 2 * MODULO, caixaLogo.tamanho + 2 * MODULO, MODULO)}" fill="${corFundo}"/>`,
      )
    }

    if (incluirLogo) {
      const origem = escaparXml(opcoes.logo)

      partes.push(
        `<image href="${origem}" xlink:href="${origem}" x="${caixaLogo.x}" y="${caixaLogo.y}" width="${caixaLogo.tamanho}" height="${caixaLogo.tamanho}" preserveAspectRatio="xMidYMid meet"/>`,
      )
    }
  }

  const [w, h] = [largura, altura].map(arredondar)

  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${partes.join('')}</svg>`,
    largura: w,
    altura: h,
    caixaLogo,
  }
}

const svgParaDataUrl = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

export { desenharQr, opcoesPadrao, svgParaDataUrl }
export type {
  CaixaLogo,
  EstiloCantos,
  EstiloPontos,
  MatrizQr,
  Moldura,
  OpcoesDesenho,
  QrDesenhado,
}
