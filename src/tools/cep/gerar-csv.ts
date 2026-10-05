import { gerarCsv } from '@/lib/csv'

import type { Endereco } from './tipos'

const colunas = [
  'CEP',
  'Logradouro',
  'Complemento',
  'Bairro',
  'Cidade',
  'UF',
  'DDD',
  'IBGE',
]

const linhaDe = (endereco: Endereco) => [
  endereco.cep,
  endereco.logradouro,
  endereco.complemento,
  endereco.bairro,
  endereco.cidade,
  endereco.uf,
  endereco.ddd,
  endereco.ibge,
]

const gerarCsvEnderecos = (enderecos: Endereco[]) =>
  gerarCsv(colunas, enderecos.map(linhaDe))

export { gerarCsvEnderecos }
