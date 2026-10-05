type DialetoSql = 'postgres' | 'mysql' | 'sqlite'

type TipoColunaSql = 'texto' | 'data'

type ColunaSql = {
  nome: string
  tipo: TipoColunaSql
  tamanho?: number
}

type OpcoesSql = {
  dialeto: DialetoSql
  tabela: string
}

const TAMANHO_LOTE_PADRAO = 100

const dialetosSql: { id: DialetoSql; rotulo: string }[] = [
  { id: 'postgres', rotulo: 'PostgreSQL' },
  { id: 'mysql', rotulo: 'MySQL / MariaDB' },
  { id: 'sqlite', rotulo: 'SQLite' },
]

const colunaId: Record<DialetoSql, string> = {
  postgres: 'integer generated always as identity primary key',
  mysql: 'int auto_increment primary key',
  sqlite: 'integer primary key autoincrement',
}

const citarIdentificador = (dialeto: DialetoSql, nome: string) =>
  dialeto === 'mysql'
    ? `\`${nome.replace(/`/g, '``')}\``
    : `"${nome.replace(/"/g, '""')}"`

const citarTabela = (dialeto: DialetoSql, tabela: string) =>
  tabela
    .split('.')
    .map((parte) => citarIdentificador(dialeto, parte.trim()))
    .join('.')

const literalSql = (dialeto: DialetoSql, valor: string | null) => {
  if (valor === null || valor === '') {
    return 'NULL'
  }

  const escapado = dialeto === 'mysql' ? valor.replace(/\\/g, '\\\\') : valor

  return `'${escapado.replace(/'/g, "''")}'`
}

const tipoSql = (dialeto: DialetoSql, coluna: ColunaSql) => {
  if (dialeto === 'sqlite') {
    return 'text'
  }

  if (coluna.tipo === 'data') {
    return 'date'
  }

  if (coluna.tamanho) {
    return `varchar(${coluna.tamanho})`
  }

  return dialeto === 'mysql' ? 'varchar(255)' : 'text'
}

const gerarCreateTable = (
  { dialeto, tabela }: OpcoesSql,
  colunas: readonly ColunaSql[],
) => {
  const definicoes = [
    `${citarIdentificador(dialeto, 'id')} ${colunaId[dialeto]}`,
    ...colunas.map(
      (coluna) =>
        `${citarIdentificador(dialeto, coluna.nome)} ${tipoSql(dialeto, coluna)}`,
    ),
  ]

  return `CREATE TABLE ${citarTabela(dialeto, tabela)} (\n  ${definicoes.join(',\n  ')}\n);`
}

const emLotes = <T>(itens: readonly T[], tamanho: number) =>
  Array.from({ length: Math.ceil(itens.length / tamanho) }, (_, indice) =>
    itens.slice(indice * tamanho, (indice + 1) * tamanho),
  )

const gerarInserts = (
  { dialeto, tabela }: OpcoesSql,
  colunas: readonly string[],
  linhas: readonly (readonly (string | null)[])[],
  tamanhoLote = TAMANHO_LOTE_PADRAO,
) => {
  const cabecalho = `INSERT INTO ${citarTabela(dialeto, tabela)} (${colunas
    .map((coluna) => citarIdentificador(dialeto, coluna))
    .join(', ')}) VALUES`

  return emLotes(linhas, tamanhoLote)
    .map((lote) => {
      const valores = lote.map(
        (linha) =>
          `(${linha.map((valor) => literalSql(dialeto, valor)).join(', ')})`,
      )

      return `${cabecalho}\n  ${valores.join(',\n  ')};`
    })
    .join('\n\n')
}

export { dialetosSql, gerarCreateTable, gerarInserts }
export type { ColunaSql, DialetoSql, OpcoesSql, TipoColunaSql }
