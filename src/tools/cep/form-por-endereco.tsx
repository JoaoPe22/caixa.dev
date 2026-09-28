'use client'

import { SearchIcon } from 'lucide-react'
import type { FormEvent } from 'react'
import { useMemo } from 'react'

import { Campo } from '@/components/campo'
import { CampoSugestoes } from '@/components/campo-sugestoes'
import { Button } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { normalizarTexto } from '@/lib/texto'
import { ufs } from '@/shared/brasil/ufs'

import { LIMITE_SUGESTOES, MINIMO_TERMO } from './constantes'
import { useMunicipios } from './use-municipios'
import { useSugestoesDeRua } from './use-sugestoes-de-rua'
import type { BuscaReversaEntrada } from './validar-busca'

type FormPorEnderecoProps = {
  uf: string
  cidade: string
  rua: string
  aoMudarUf: (uf: string) => void
  aoMudarCidade: (cidade: string) => void
  aoMudarRua: (rua: string) => void
  aoConsultar: (entrada: BuscaReversaEntrada) => void
  consultando: boolean
  desabilitado: boolean
}

const plural = (quantidade: number, singular: string, varios: string) =>
  `${quantidade} ${quantidade === 1 ? singular : varios}`

const FormPorEndereco = ({
  uf,
  cidade,
  rua,
  aoMudarUf,
  aoMudarCidade,
  aoMudarRua,
  aoConsultar,
  consultando,
  desabilitado,
}: FormPorEnderecoProps) => {
  const municipiosDaUf = useMunicipios(uf)

  const cidadeNormalizada = normalizarTexto(cidade)

  const municipiosIndexados = useMemo(
    () =>
      municipiosDaUf.municipios.map((municipio) => ({
        municipio,
        chave: normalizarTexto(municipio.nome),
      })),
    [municipiosDaUf.municipios],
  )

  const municipioEscolhido =
    municipiosIndexados.find((item) => item.chave === cidadeNormalizada)
      ?.municipio ?? null

  const municipiosFiltrados = useMemo(
    () =>
      municipiosIndexados
        .filter((item) => item.chave.includes(cidadeNormalizada))
        .sort(
          (a, b) =>
            Number(!a.chave.startsWith(cidadeNormalizada)) -
            Number(!b.chave.startsWith(cidadeNormalizada)),
        ),
    [municipiosIndexados, cidadeNormalizada],
  )

  const cidadeValida =
    municipiosIndexados.length > 0
      ? municipioEscolhido !== null
      : cidade.trim().length >= MINIMO_TERMO

  const cidadeParaBusca = municipioEscolhido?.nome ?? cidade.trim()

  const sugestoesDeRua = useSugestoesDeRua(
    uf,
    cidadeParaBusca,
    rua,
    Boolean(uf) && cidadeValida,
  )

  const mensagemCidade = !uf
    ? 'Escolha o estado primeiro.'
    : municipiosDaUf.erro
      ? municipiosDaUf.erro
      : 'Nenhum município encontrado.'

  const mensagemRua = !sugestoesDeRua.ativo
    ? `Digite pelo menos ${MINIMO_TERMO} letras.`
    : sugestoesDeRua.cepUnico
      ? `Esta cidade tem CEP único: ${sugestoesDeRua.cepUnico}`
      : (sugestoesDeRua.erro ?? 'Nenhuma rua encontrada.')

  const rodapeCidade =
    municipiosFiltrados.length > LIMITE_SUGESTOES
      ? `Mostrando ${LIMITE_SUGESTOES} de ${municipiosFiltrados.length}. Continue digitando.`
      : null

  const rodapeRua = sugestoesDeRua.truncado
    ? 'Lista parcial: o ViaCEP devolve no máximo 50 CEPs. Continue digitando.'
    : null

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    aoConsultar({ uf, cidade: cidadeParaBusca, rua })
  }

  return (
    <form
      onSubmit={enviar}
      className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.5fr)_auto]"
    >
      <Campo rotulo="Estado">
        <NativeSelect
          value={uf}
          onChange={(evento) => aoMudarUf(evento.target.value)}
          className="w-full"
        >
          <NativeSelectOption value="">Selecione…</NativeSelectOption>
          {ufs.map((estado) => (
            <NativeSelectOption key={estado.sigla} value={estado.sigla}>
              {estado.nome} ({estado.sigla})
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Campo>

      <Campo rotulo="Cidade / Município">
        <CampoSugestoes
          rotulo="Cidade ou município"
          valor={cidade}
          aoMudar={aoMudarCidade}
          aoEscolher={(sugestao) => aoMudarCidade(sugestao.rotulo)}
          sugestoes={municipiosFiltrados
            .slice(0, LIMITE_SUGESTOES)
            .map(({ municipio }) => ({
              valor: municipio.ibge,
              rotulo: municipio.nome,
            }))}
          carregando={municipiosDaUf.carregando}
          mensagemVazia={mensagemCidade}
          rodape={rodapeCidade}
          placeholder={uf ? 'Digite para filtrar' : 'Escolha o estado'}
          disabled={!uf}
        />
      </Campo>

      <Campo rotulo="Rua" dica={`mín. ${MINIMO_TERMO} letras`}>
        <CampoSugestoes
          rotulo="Rua"
          valor={rua}
          aoMudar={aoMudarRua}
          aoEscolher={(sugestao) => aoMudarRua(sugestao.valor)}
          sugestoes={sugestoesDeRua.ruas.map((ruaSugerida) => ({
            valor: ruaSugerida.nome,
            rotulo: ruaSugerida.nome,
            detalhe: `${plural(ruaSugerida.ceps, 'CEP', 'CEPs')} · ${plural(ruaSugerida.bairros, 'bairro', 'bairros')}`,
          }))}
          carregando={sugestoesDeRua.carregando}
          mensagemVazia={mensagemRua}
          rodape={rodapeRua}
          placeholder={
            cidadeValida ? 'Avenida Brasil' : 'Escolha a cidade na lista'
          }
          disabled={!uf || !cidadeValida}
        />
      </Campo>

      <Button type="submit" disabled={desabilitado}>
        <SearchIcon className="size-4" />
        {consultando ? 'Consultando…' : 'Consultar'}
      </Button>
    </form>
  )
}

export { FormPorEndereco }
