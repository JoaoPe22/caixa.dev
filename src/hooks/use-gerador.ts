import { useState } from 'react'

const useGerador = <Opcoes extends object, Resultado>(
  gerar: (opcoes: Opcoes) => Resultado,
  opcoesIniciais: Opcoes,
  resultadoInicial: Resultado,
) => {
  const [opcoes, setOpcoes] = useState(opcoesIniciais)
  const [resultado, setResultado] = useState(resultadoInicial)

  const atualizar = (parcial: Partial<Opcoes>) => {
    const novas = { ...opcoes, ...parcial }

    setOpcoes(novas)
    setResultado(gerar(novas))
  }

  const gerarNovamente = () => setResultado(gerar(opcoes))

  return { opcoes, resultado, atualizar, gerarNovamente }
}

export { useGerador }
