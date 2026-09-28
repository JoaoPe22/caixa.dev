const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const formatarData = (iso: string) => {
  const [ano, mes, dia] = iso.split('-')

  return ano && mes && dia ? `${dia}/${mes}/${ano}` : iso
}

const formatarMoeda = (valor: number) => moeda.format(valor)

export { formatarData, formatarMoeda }
