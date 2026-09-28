type Endereco = {
  cep: string
  logradouro: string
  complemento: string
  unidade: string
  bairro: string
  cidade: string
  uf: string
  estado: string
  regiao: string
  ddd: string
  ibge: string
}

type CepResultado = Endereco & {
  microrregiao: string | null
  mesorregiao: string | null
}

type BuscaReversa = {
  enderecos: Endereco[]
  truncado: boolean
}

type Municipio = {
  nome: string
  ibge: string
}

export type { BuscaReversa, CepResultado, Endereco, Municipio }
