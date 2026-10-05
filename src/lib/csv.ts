const BOM_UTF8 = String.fromCharCode(0xfeff)

const escapar = (valor: string) => `"${valor.replace(/"/g, '""')}"`

const linhaCsv = (valores: readonly string[]) => valores.map(escapar).join(';')

const gerarCsv = (
  cabecalho: readonly string[],
  linhas: readonly (readonly string[])[],
) => BOM_UTF8 + [cabecalho, ...linhas].map(linhaCsv).join('\r\n')

export { gerarCsv }
