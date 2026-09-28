type Atividade = {
  codigo: string
  descricao: string
}

type Telefone = {
  numero: string
  fax: boolean
}

type OpcaoTributaria = {
  optante: boolean | null
  dataOpcao: string
  dataExclusao: string
}

type Representante = {
  nome: string
  qualificacao: string
}

type Socio = {
  nome: string
  documento: string
  tipo: string
  qualificacao: string
  dataEntrada: string
  faixaEtaria: string
  pais: string
  representante: Representante | null
}

type Endereco = {
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cep: string
  municipio: string
  uf: string
}

type Empresa = {
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  situacao: string
  dataSituacao: string
  motivoSituacao: string
  situacaoEspecial: string
  dataSituacaoEspecial: string
  matrizFilial: string
  dataAbertura: string
  naturezaJuridica: string
  porte: string
  capitalSocial: number | null
  atividadePrincipal: Atividade | null
  atividadesSecundarias: Atividade[]
  endereco: Endereco
  telefones: Telefone[]
  email: string
  simples: OpcaoTributaria
  mei: OpcaoTributaria
  socios: Socio[]
}

export type {
  Atividade,
  Empresa,
  Endereco,
  OpcaoTributaria,
  Representante,
  Socio,
  Telefone,
}
