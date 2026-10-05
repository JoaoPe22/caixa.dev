'use client'

import { useState } from 'react'

import { Alerta } from '@/components/alerta'
import { CaixaDeSelecao } from '@/components/caixa-de-selecao'
import { CampoQuantidade } from '@/components/campo-quantidade'
import { CampoUf } from '@/components/campo-uf'
import { ListaDeValores } from '@/components/lista-de-valores'
import { PainelGerador } from '@/components/painel-gerador'
import { ValidadorDocumento } from '@/components/validador-documento'
import { useGerador } from '@/hooks/use-gerador'
import { formatarCpf, normalizarCpf } from '@/shared/brasil/cpf'

import { AVISO_CPF_FICTICIO } from './constantes'
import { gerarCpfs, opcoesPadrao } from './gerar-cpfs'

type GeradorDeCpfFormProps = {
  inicial: string[]
}

const GeradorDeCpfForm = ({ inicial }: GeradorDeCpfFormProps) => {
  const { opcoes, resultado, atualizar, gerarNovamente } = useGerador(
    gerarCpfs,
    opcoesPadrao,
    inicial,
  )
  const [comMascara, setComMascara] = useState(true)

  const cpfs = comMascara ? resultado.map(formatarCpf) : resultado

  return (
    <div className="flex flex-col gap-6">
      <PainelGerador
        aoGerarNovamente={gerarNovamente}
        opcoes={
          <>
            <CampoUf
              rotulo="Estado de emissão"
              rotuloVazio="Qualquer estado"
              valor={opcoes.uf}
              aoMudar={(uf) => atualizar({ uf })}
            />

            <CampoQuantidade
              valor={opcoes.quantidade}
              aoMudar={(quantidade) => atualizar({ quantidade })}
            />

            <CaixaDeSelecao
              rotulo="Com máscara (000.000.000-00)"
              marcada={comMascara}
              aoMudar={setComMascara}
            />
          </>
        }
        resultado={
          <>
            <ListaDeValores valores={cpfs} nomeArquivo="cpfs" />
            <Alerta variante="aviso">{AVISO_CPF_FICTICIO}</Alerta>
          </>
        }
      />

      <ValidadorDocumento
        rotulo="CPF"
        exemplo="000.000.000-00"
        formatar={formatarCpf}
        validar={(valor) => normalizarCpf(valor) !== null}
      />
    </div>
  )
}

export { GeradorDeCpfForm }
