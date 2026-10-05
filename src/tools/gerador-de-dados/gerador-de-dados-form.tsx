'use client'

import { useMemo, useState } from 'react'

import { Alerta } from '@/components/alerta'
import { BlocoDeCodigo } from '@/components/bloco-de-codigo'
import { CaixaDeSelecao } from '@/components/caixa-de-selecao'
import { Campo, GrupoDeCampos } from '@/components/campo'
import { CampoQuantidade } from '@/components/campo-quantidade'
import { CampoUf } from '@/components/campo-uf'
import { PainelGerador } from '@/components/painel-gerador'
import { TabelaDeDados } from '@/components/tabela-de-dados'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGerador } from '@/hooks/use-gerador'

import {
  AVISO_DADOS_FICTICIOS,
  colunasPorEntidade,
  entidades,
  LIMITE_PREVIA,
  opcoesGeracaoPadrao,
  opcoesSaidaPadrao,
  tabelaPadrao,
  todasAsColunas,
} from './constantes'
import { gerarRegistros } from './gerar-registros'
import { montarLinhas, montarSaida } from './montar-saida'
import { SaidaSql } from './saida-sql'
import type {
  Entidade,
  EstiloNome,
  FormatoSaida,
  OpcoesSaida,
  Registro,
} from './tipos'

type GeradorDeDadosFormProps = {
  inicial: Registro[]
}

const formatosSaida: { id: FormatoSaida; rotulo: string }[] = [
  { id: 'tabela', rotulo: 'Tabela' },
  { id: 'json', rotulo: 'JSON' },
  { id: 'csv', rotulo: 'CSV' },
  { id: 'sql', rotulo: 'SQL' },
]

const GeradorDeDadosForm = ({ inicial }: GeradorDeDadosFormProps) => {
  const { opcoes, resultado, atualizar, gerarNovamente } = useGerador(
    gerarRegistros,
    opcoesGeracaoPadrao,
    inicial,
  )
  const [saida, setSaida] = useState<OpcoesSaida>(opcoesSaidaPadrao)
  const [formato, setFormato] = useState<FormatoSaida>('tabela')

  const atualizarSaida = (parcial: Partial<OpcoesSaida>) =>
    setSaida((anterior) => ({ ...anterior, ...parcial }))

  const mudarEntidade = (entidade: Entidade) => {
    atualizar({ entidade })
    atualizarSaida({
      colunas: todasAsColunas(entidade),
      tabela: tabelaPadrao(entidade),
    })
  }

  const alternarColuna = (chave: string, marcada: boolean) =>
    atualizarSaida({
      colunas: marcada
        ? [...saida.colunas, chave]
        : saida.colunas.filter((coluna) => coluna !== chave),
    })

  const colunasDaEntidade = colunasPorEntidade[opcoes.entidade]
  const colunas = useMemo(
    () =>
      colunasDaEntidade.filter((coluna) =>
        saida.colunas.includes(coluna.chave),
      ),
    [colunasDaEntidade, saida.colunas],
  )

  const conteudo = useMemo(() => {
    if (formato === 'tabela') {
      return null
    }

    return montarSaida(formato, resultado, colunas, saida)
  }, [formato, resultado, colunas, saida])

  const previa = useMemo(
    () =>
      montarLinhas(
        resultado.slice(0, LIMITE_PREVIA),
        colunas,
        saida.comMascara,
      ),
    [resultado, colunas, saida.comMascara],
  )

  return (
    <PainelGerador
      aoGerarNovamente={gerarNovamente}
      opcoes={
        <>
          <Campo rotulo="Tipo de cadastro">
            <NativeSelect
              value={opcoes.entidade}
              onChange={(evento) =>
                mudarEntidade(evento.target.value as Entidade)
              }
              className="w-full"
            >
              {entidades.map(({ id, rotulo }) => (
                <NativeSelectOption key={id} value={id}>
                  {rotulo}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Campo>

          <CampoUf
            rotuloVazio="Qualquer estado"
            valor={opcoes.uf}
            aoMudar={(uf) => atualizar({ uf })}
          />

          <CampoQuantidade
            valor={opcoes.quantidade}
            aoMudar={(quantidade) => atualizar({ quantidade })}
          />

          <Campo rotulo="Nomes das colunas">
            <NativeSelect
              value={saida.estiloNome}
              onChange={(evento) =>
                atualizarSaida({
                  estiloNome: evento.target.value as EstiloNome,
                })
              }
              className="w-full"
            >
              <NativeSelectOption value="snake">snake_case</NativeSelectOption>
              <NativeSelectOption value="camel">camelCase</NativeSelectOption>
            </NativeSelect>
          </Campo>

          <CaixaDeSelecao
            rotulo="CPF, CNPJ, CEP e telefone com máscara"
            marcada={saida.comMascara}
            aoMudar={(comMascara) => atualizarSaida({ comMascara })}
          />

          <GrupoDeCampos rotulo="Colunas">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {colunasDaEntidade.map((coluna) => (
                <CaixaDeSelecao
                  key={coluna.chave}
                  rotulo={coluna.rotulo}
                  marcada={saida.colunas.includes(coluna.chave)}
                  aoMudar={(marcada) => alternarColuna(coluna.chave, marcada)}
                />
              ))}
            </div>
          </GrupoDeCampos>
        </>
      }
      resultado={
        <>
          <Tabs
            value={formato}
            onValueChange={(valor) => setFormato(valor as FormatoSaida)}
          >
            <TabsList>
              {formatosSaida.map(({ id, rotulo }) => (
                <TabsTrigger key={id} value={id}>
                  {rotulo}
                </TabsTrigger>
              ))}
            </TabsList>

            {colunas.length === 0 ? (
              <Alerta>Marque pelo menos uma coluna.</Alerta>
            ) : (
              formatosSaida.map(({ id }) => (
                <TabsContent
                  key={id}
                  value={id}
                  className="flex flex-col gap-3"
                >
                  {id === 'sql' ? (
                    <SaidaSql opcoes={saida} atualizar={atualizarSaida} />
                  ) : null}

                  {id === 'tabela' ? (
                    <>
                      <TabelaDeDados
                        cabecalho={colunas.map((coluna) => coluna.rotulo)}
                        linhas={previa}
                      />
                      {resultado.length > LIMITE_PREVIA ? (
                        <p className="text-xs text-muted-foreground">
                          Prévia com {LIMITE_PREVIA} de {resultado.length}{' '}
                          registros. Os formatos JSON, CSV e SQL trazem todos.
                        </p>
                      ) : null}
                    </>
                  ) : conteudo ? (
                    <BlocoDeCodigo {...conteudo} />
                  ) : null}
                </TabsContent>
              ))
            )}
          </Tabs>

          <Alerta variante="aviso">{AVISO_DADOS_FICTICIOS}</Alerta>
        </>
      }
    />
  )
}

export { GeradorDeDadosForm }
