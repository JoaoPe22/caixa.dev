import { formatarCep } from '@/shared/brasil/cep'
import { formatarCnpj } from '@/shared/brasil/cnpj'
import { formatarCpf } from '@/shared/brasil/cpf'
import { formatarTelefone } from '@/shared/brasil/telefone'

import type { ColunaDados, Entidade, OpcoesGeracao, OpcoesSaida } from './tipos'

const LIMITE_PREVIA = 100

const AVISO_DADOS_FICTICIOS =
  'Dados fictícios, gerados no seu navegador e não salvos. CPF, CNPJ e telefone podem coincidir com reais por acaso; os e-mails usam domínios reservados para teste.'

const entidades: { id: Entidade; rotulo: string; tabela: string }[] = [
  { id: 'pessoa', rotulo: 'Pessoa', tabela: 'pessoas' },
  { id: 'empresa', rotulo: 'Empresa', tabela: 'empresas' },
]

const colunasEndereco: ColunaDados[] = [
  {
    chave: 'cep',
    rotulo: 'CEP',
    tipo: 'texto',
    tamanho: 9,
    formatar: formatarCep,
  },
  { chave: 'logradouro', rotulo: 'Logradouro', tipo: 'texto', tamanho: 120 },
  { chave: 'numero', rotulo: 'Número', tipo: 'texto', tamanho: 10 },
  { chave: 'complemento', rotulo: 'Complemento', tipo: 'texto', tamanho: 60 },
  { chave: 'bairro', rotulo: 'Bairro', tipo: 'texto', tamanho: 80 },
  { chave: 'cidade', rotulo: 'Cidade', tipo: 'texto', tamanho: 80 },
  { chave: 'uf', rotulo: 'UF', tipo: 'texto', tamanho: 2 },
  { chave: 'ibge', rotulo: 'Código IBGE', tipo: 'texto', tamanho: 7 },
]

const colunasPorEntidade: Record<Entidade, ColunaDados[]> = {
  pessoa: [
    { chave: 'nome', rotulo: 'Nome', tipo: 'texto', tamanho: 120 },
    {
      chave: 'cpf',
      rotulo: 'CPF',
      tipo: 'texto',
      tamanho: 14,
      formatar: formatarCpf,
    },
    { chave: 'dataNascimento', rotulo: 'Nascimento', tipo: 'data' },
    { chave: 'email', rotulo: 'E-mail', tipo: 'texto', tamanho: 160 },
    {
      chave: 'celular',
      rotulo: 'Celular',
      tipo: 'texto',
      tamanho: 15,
      formatar: formatarTelefone,
    },
    ...colunasEndereco,
  ],
  empresa: [
    {
      chave: 'razaoSocial',
      rotulo: 'Razão social',
      tipo: 'texto',
      tamanho: 150,
    },
    {
      chave: 'nomeFantasia',
      rotulo: 'Nome fantasia',
      tipo: 'texto',
      tamanho: 120,
    },
    {
      chave: 'cnpj',
      rotulo: 'CNPJ',
      tipo: 'texto',
      tamanho: 18,
      formatar: formatarCnpj,
    },
    { chave: 'dataAbertura', rotulo: 'Abertura', tipo: 'data' },
    { chave: 'email', rotulo: 'E-mail', tipo: 'texto', tamanho: 160 },
    {
      chave: 'telefone',
      rotulo: 'Telefone',
      tipo: 'texto',
      tamanho: 15,
      formatar: formatarTelefone,
    },
    ...colunasEndereco,
  ],
}

const todasAsColunas = (entidade: Entidade) =>
  colunasPorEntidade[entidade].map((coluna) => coluna.chave)

const tabelaPadrao = (entidade: Entidade) =>
  entidades.find((item) => item.id === entidade)?.tabela ?? entidade

const opcoesGeracaoPadrao: OpcoesGeracao = {
  entidade: 'pessoa',
  quantidade: 10,
  uf: '',
}

const opcoesSaidaPadrao: OpcoesSaida = {
  colunas: todasAsColunas(opcoesGeracaoPadrao.entidade),
  comMascara: true,
  estiloNome: 'snake',
  dialeto: 'postgres',
  tabela: tabelaPadrao(opcoesGeracaoPadrao.entidade),
  comCreateTable: true,
}

export {
  AVISO_DADOS_FICTICIOS,
  colunasPorEntidade,
  entidades,
  LIMITE_PREVIA,
  opcoesGeracaoPadrao,
  opcoesSaidaPadrao,
  tabelaPadrao,
  todasAsColunas,
}
