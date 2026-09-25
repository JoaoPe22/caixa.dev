type ToolCategoria = 'brasil' | 'dados' | 'texto' | 'web' | 'tempo'

type CategoriaInfo = {
  nome: string
  descricao: string
}

const categorias: Record<ToolCategoria, CategoriaInfo> = {
  brasil: {
    nome: 'Brasil',
    descricao: 'Consultas a dados públicos brasileiros',
  },
  dados: {
    nome: 'Dados',
    descricao: 'Converter, formatar e inspecionar dados',
  },
  texto: {
    nome: 'Texto',
    descricao: 'Transformar e analisar texto',
  },
  web: {
    nome: 'Web',
    descricao: 'Utilidades de desenvolvimento web',
  },
  tempo: {
    nome: 'Tempo',
    descricao: 'Datas, horários e fusos',
  },
}

const ordemCategorias: ToolCategoria[] = [
  'brasil',
  'dados',
  'texto',
  'web',
  'tempo',
]

export { categorias, ordemCategorias }
export type { CategoriaInfo, ToolCategoria }
