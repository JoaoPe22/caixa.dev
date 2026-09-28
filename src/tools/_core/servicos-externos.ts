import type { RegraDeLimite } from './limite-de-taxa'

const SERVICOS_EXTERNOS = {
  viacep: { nome: 'servico:viacep', requisicoes: 300, janela: '60 s' },
  ibge: { nome: 'servico:ibge', requisicoes: 300, janela: '60 s' },
} satisfies Record<string, RegraDeLimite>

type ServicoExterno = keyof typeof SERVICOS_EXTERNOS

export { SERVICOS_EXTERNOS }
export type { ServicoExterno }
