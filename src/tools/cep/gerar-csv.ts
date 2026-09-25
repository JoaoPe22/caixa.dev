import type { Endereco } from './consultar-cep'

const BOM_UTF8 = String.fromCharCode(0xfeff)

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

const escapar = (valor: string) => `"${valor.replace(/"/g, '""')}"`

const linhaDe = (endereco: Endereco) =>
  [
    endereco.cep,
    endereco.logradouro,
    endereco.complemento,
    endereco.bairro,
    endereco.cidade,
    endereco.uf,
    endereco.ddd,
    endereco.ibge,
  ]
    .map(escapar)
    .join(';')

const gerarCsv = (enderecos: Endereco[]) =>
  BOM_UTF8 +
  [colunas.map(escapar).join(';'), ...enderecos.map(linhaDe)].join('\r\n')

export { gerarCsv }
