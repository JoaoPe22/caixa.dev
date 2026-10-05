import {
  chance,
  dataAleatoria,
  escolher,
  inteiroAleatorio,
} from '@/lib/aleatorio'
import { paraSlug } from '@/lib/texto'

import { gerarCnpj } from '../cnpj'
import { gerarCpf } from '../cpf'
import { gerarCelular, gerarTelefoneFixo } from '../telefone'
import { naturezas, nucleosDeNome, ramos } from './empresas'
import { bairros, capitais, logradouros } from './localidades'
import { nomesFemininos, nomesMasculinos, sobrenomes } from './nomes'

type EnderecoFicticio = {
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
  ibge: string
}

type PessoaFicticia = EnderecoFicticio & {
  nome: string
  cpf: string
  dataNascimento: string
  email: string
  celular: string
}

type EmpresaFicticia = EnderecoFicticio & {
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  dataAbertura: string
  email: string
  telefone: string
}

type OpcoesFicticias = {
  uf?: string
}

// Domínios reservados pela RFC 2606: nenhum e-mail de teste chega a uma pessoa real.
const DOMINIOS_RESERVADOS = ['example.com', 'example.net', 'example.org']
const IDADE_MINIMA = 18
const IDADE_MAXIMA = 80
const PRIMEIRA_ABERTURA = new Date('1990-01-01')

const anosAtras = (anos: number) => {
  const data = new Date()

  data.setFullYear(data.getFullYear() - anos)

  return data
}

const dataIso = (data: Date) => data.toISOString().slice(0, 10)

const capitalDa = (uf?: string) =>
  capitais.find((capital) => capital.uf === uf?.toUpperCase()) ??
  escolher(capitais)

const gerarEndereco = (
  { uf }: OpcoesFicticias = {},
  complementos: readonly string[] = ['Apto', 'Casa', 'Bloco'],
) => {
  const capital = capitalDa(uf)
  const [inicioCep, fimCep] = capital.faixaCep
  const prefixoCep = String(inteiroAleatorio(inicioCep, fimCep)).padStart(
    5,
    '0',
  )

  const endereco: EnderecoFicticio = {
    cep: `${prefixoCep}${String(inteiroAleatorio(0, 899)).padStart(3, '0')}`,
    logradouro: escolher(logradouros),
    numero: String(inteiroAleatorio(1, 3000)),
    complemento: chance(0.4)
      ? `${escolher(complementos)} ${inteiroAleatorio(1, 300)}`
      : '',
    bairro: escolher(bairros),
    cidade: capital.cidade,
    uf: capital.uf,
    ibge: capital.ibge,
  }

  return { endereco, ddd: capital.ddd }
}

const gerarPessoa = (opcoes: OpcoesFicticias = {}): PessoaFicticia => {
  const { endereco, ddd } = gerarEndereco(opcoes)
  const primeiroNome = escolher(chance(0.5) ? nomesFemininos : nomesMasculinos)
  const nomeDoMeio = escolher(sobrenomes)
  const ultimoNome = escolher(sobrenomes.filter((nome) => nome !== nomeDoMeio))
  const sufixoEmail = chance(0.5) ? String(inteiroAleatorio(1, 99)) : ''

  return {
    nome: `${primeiroNome} ${nomeDoMeio} ${ultimoNome}`,
    cpf: gerarCpf({ uf: endereco.uf }),
    dataNascimento: dataIso(
      dataAleatoria(anosAtras(IDADE_MAXIMA), anosAtras(IDADE_MINIMA)),
    ),
    email: `${paraSlug(`${primeiroNome} ${ultimoNome}`, '.')}${sufixoEmail}@${escolher(DOMINIOS_RESERVADOS)}`,
    celular: gerarCelular(ddd),
    ...endereco,
  }
}

const gerarEmpresa = (opcoes: OpcoesFicticias = {}): EmpresaFicticia => {
  const { endereco, ddd } = gerarEndereco(opcoes, ['Sala', 'Galpão', 'Loja'])
  const nucleo = chance(0.3)
    ? `${escolher(sobrenomes)} & ${escolher(sobrenomes)}`
    : escolher(nucleosDeNome)
  const ramo = escolher(ramos)
  const nomeFantasia = `${nucleo} ${ramo.fantasia}`

  return {
    razaoSocial:
      `${nucleo} ${ramo.atividade} ${escolher(naturezas)}`.toUpperCase(),
    nomeFantasia,
    cnpj: gerarCnpj(),
    dataAbertura: dataIso(dataAleatoria(PRIMEIRA_ABERTURA, new Date())),
    email: `${escolher(['contato', 'comercial', 'financeiro'])}@${paraSlug(nomeFantasia, '')}.${escolher(DOMINIOS_RESERVADOS)}`,
    telefone: chance(0.7) ? gerarTelefoneFixo(ddd) : gerarCelular(ddd),
    ...endereco,
  }
}

export { gerarEmpresa, gerarPessoa }
export type {
  EmpresaFicticia,
  EnderecoFicticio,
  OpcoesFicticias,
  PessoaFicticia,
}
