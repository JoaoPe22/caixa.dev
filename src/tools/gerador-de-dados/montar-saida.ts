import { gerarCsv } from '@/lib/csv'
import { gerarCreateTable, gerarInserts } from '@/lib/sql'
import { camelParaSnake } from '@/lib/texto'

import type {
  ColunaDados,
  EstiloNome,
  FormatoSaida,
  OpcoesSaida,
  Registro,
} from './tipos'

type Saida = {
  conteudo: string
  nomeArquivo: string
  tipoMime: string
}

const nomeDaColuna = (coluna: ColunaDados, estilo: EstiloNome) =>
  estilo === 'snake' ? camelParaSnake(coluna.chave) : coluna.chave

const valorDe = (
  registro: Registro,
  coluna: ColunaDados,
  comMascara: boolean,
) => {
  const bruto = registro[coluna.chave] ?? ''

  return comMascara && coluna.formatar && bruto ? coluna.formatar(bruto) : bruto
}

const montarLinhas = (
  registros: readonly Registro[],
  colunas: readonly ColunaDados[],
  comMascara: boolean,
) =>
  registros.map((registro) =>
    colunas.map((coluna) => valorDe(registro, coluna, comMascara)),
  )

const montarSaida = (
  formato: Exclude<FormatoSaida, 'tabela'>,
  registros: readonly Registro[],
  colunas: readonly ColunaDados[],
  opcoes: OpcoesSaida,
): Saida => {
  const nomes = colunas.map((coluna) => nomeDaColuna(coluna, opcoes.estiloNome))
  const linhas = montarLinhas(registros, colunas, opcoes.comMascara)
  const tabela = opcoes.tabela.trim() || 'dados'

  if (formato === 'json') {
    const objetos = linhas.map((linha) =>
      Object.fromEntries(
        nomes.map((nome, indice) => [nome, linha[indice] || null]),
      ),
    )

    return {
      conteudo: JSON.stringify(objetos, null, 2),
      nomeArquivo: `${tabela}.json`,
      tipoMime: 'application/json',
    }
  }

  if (formato === 'csv') {
    return {
      conteudo: gerarCsv(nomes, linhas),
      nomeArquivo: `${tabela}.csv`,
      tipoMime: 'text/csv',
    }
  }

  const sql = { dialeto: opcoes.dialeto, tabela }
  const createTable = opcoes.comCreateTable
    ? gerarCreateTable(
        sql,
        colunas.map((coluna, indice) => ({
          nome: nomes[indice] ?? coluna.chave,
          tipo: coluna.tipo,
          tamanho: coluna.tamanho,
        })),
      )
    : null

  return {
    conteudo: [createTable, gerarInserts(sql, nomes, linhas)]
      .filter(Boolean)
      .join('\n\n'),
    nomeArquivo: `${tabela}.sql`,
    tipoMime: 'application/sql',
  }
}

export { montarLinhas, montarSaida }
export type { Saida }
