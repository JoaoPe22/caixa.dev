import type { OpcaoTributaria } from './empresa'

const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const formatarData = (iso: string) => {
  const [ano, mes, dia] = iso.split('-')

  return ano && mes && dia ? `${dia}/${mes}/${ano}` : iso
}

const formatarCnae = (codigo: string) =>
  /^\d{7}$/.test(codigo)
    ? `${codigo.slice(0, 4)}-${codigo.slice(4, 5)}/${codigo.slice(5)}`
    : codigo

const formatarTelefone = (numero: string) => {
  if (numero.length === 10) {
    return `(${numero.slice(0, 2)}) ${numero.slice(2, 6)}-${numero.slice(6)}`
  }

  if (numero.length === 11) {
    return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`
  }

  return numero
}

const formatarCep = (cep: string) =>
  /^\d{8}$/.test(cep) ? `${cep.slice(0, 5)}-${cep.slice(5)}` : cep

const formatarMoeda = (valor: number) => moeda.format(valor)

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

export {
  descreverOpcao,
  formatarCep,
  formatarCnae,
  formatarData,
  formatarMoeda,
  formatarTelefone,
}
