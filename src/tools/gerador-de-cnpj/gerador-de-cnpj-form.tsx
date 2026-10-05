'use client'

import { useState } from 'react'

import { Alerta } from '@/components/alerta'
import { CaixaDeSelecao } from '@/components/caixa-de-selecao'
import { Campo } from '@/components/campo'
import { CampoQuantidade } from '@/components/campo-quantidade'
import { ListaDeValores } from '@/components/lista-de-valores'
import { PainelGerador } from '@/components/painel-gerador'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { ValidadorDocumento } from '@/components/validador-documento'
import { useGerador } from '@/hooks/use-gerador'
import { formatarCnpj, normalizarCnpj } from '@/shared/brasil/cnpj'

import { AVISO_CNPJ_FICTICIO } from './constantes'
import type { FormatoCnpj } from './gerar-cnpjs'
import { formatos, gerarCnpjs, opcoesPadrao } from './gerar-cnpjs'

type GeradorDeCnpjFormProps = {
  inicial: string[]
}

const GeradorDeCnpjForm = ({ inicial }: GeradorDeCnpjFormProps) => {
  const { opcoes, resultado, atualizar, gerarNovamente } = useGerador(
    gerarCnpjs,
    opcoesPadrao,
    inicial,
  )
  const [comMascara, setComMascara] = useState(true)

  const cnpjs = comMascara ? resultado.map(formatarCnpj) : resultado

  return (
    <div className="flex flex-col gap-6">
      <PainelGerador
        aoGerarNovamente={gerarNovamente}
        opcoes={
          <>
            <Campo rotulo="Formato">
              <NativeSelect
                value={opcoes.formato}
                onChange={(evento) =>
                  atualizar({ formato: evento.target.value as FormatoCnpj })
                }
                className="w-full"
              >
                {formatos.map(({ id, rotulo }) => (
                  <NativeSelectOption key={id} value={id}>
                    {rotulo}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Campo>

            <Campo rotulo="Estabelecimento">
              <NativeSelect
                value={opcoes.matriz ? 'matriz' : 'filial'}
                onChange={(evento) =>
                  atualizar({ matriz: evento.target.value === 'matriz' })
                }
                className="w-full"
              >
                <NativeSelectOption value="matriz">
                  Matriz (0001)
                </NativeSelectOption>
                <NativeSelectOption value="filial">
                  Filial aleatória
                </NativeSelectOption>
              </NativeSelect>
            </Campo>

            <CampoQuantidade
              valor={opcoes.quantidade}
              aoMudar={(quantidade) => atualizar({ quantidade })}
            />

            <CaixaDeSelecao
              rotulo="Com máscara (00.000.000/0000-00)"
              marcada={comMascara}
              aoMudar={setComMascara}
            />
          </>
        }
        resultado={
          <>
            <ListaDeValores valores={cnpjs} nomeArquivo="cnpjs" />
            <Alerta variante="aviso">{AVISO_CNPJ_FICTICIO}</Alerta>
          </>
        }
      />

      <ValidadorDocumento
        rotulo="CNPJ"
        exemplo="00.000.000/0000-00"
        formatar={formatarCnpj}
        validar={(valor) => normalizarCnpj(valor) !== null}
      />
    </div>
  )
}

export { GeradorDeCnpjForm }
