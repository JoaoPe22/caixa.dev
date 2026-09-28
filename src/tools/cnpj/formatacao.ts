import { formatarData } from '@/shared/brasil/formatacao'

import type { OpcaoTributaria } from './tipos'

const formatarCnae = (codigo: string) =>
  /^\d{7}$/.test(codigo)
    ? `${codigo.slice(0, 4)}-${codigo.slice(4, 5)}/${codigo.slice(5)}`
    : codigo

const descreverOpcao = (opcao: OpcaoTributaria) => {
  if (opcao.optante === null) {
    return ''
  }

  if (opcao.optante) {
    return opcao.dataOpcao
      ? `Sim, desde ${formatarData(opcao.dataOpcao)}`
      : 'Sim'
  }

  return opcao.dataExclusao
    ? `Não (excluída em ${formatarData(opcao.dataExclusao)})`
    : 'Não'
}

export { descreverOpcao, formatarCnae }
