import { luminancia, razaoDeContraste } from '@/lib/contraste'

import type { OpcoesDesenho } from './desenhar-qr'

const CONTRASTE_MINIMO = 3

const avisosDeLeitura = ({
  corFrente,
  corFundo,
  fundoTransparente,
}: OpcoesDesenho): string[] => {
  if (fundoTransparente) {
    return ['Fundo transparente: use o QR sobre uma superfície clara.']
  }

  if (luminancia(corFrente) > luminancia(corFundo)) {
    return [
      'Cores invertidas (QR claro em fundo escuro): muitos leitores não conseguem ler.',
    ]
  }

  if (razaoDeContraste(corFrente, corFundo) < CONTRASTE_MINIMO) {
    return ['Contraste baixo entre as cores: a leitura pode falhar.']
  }

  return []
}

export { avisosDeLeitura }
