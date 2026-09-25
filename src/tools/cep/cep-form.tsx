'use client'

import { EraserIcon, SearchIcon } from 'lucide-react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { useMemo, useRef, useState } from 'react'

import { CampoSugestoes } from '@/components/campo-sugestoes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ValorCopiavel } from '@/components/valor-copiavel'
import { normalizarTexto } from '@/lib/texto'
import { ufs } from '@/shared/brasil/ufs'
import type { Envelope } from '@/tools/_core/api-helpers'

import { LIMITE_SUGESTOES, MINIMO_TERMO } from './constantes'
import type { BuscaReversa, CepResultado } from './consultar-cep'
import { formatarCep, normalizarCep } from './normalizar-cep'
import { TabelaEnderecos } from './tabela-enderecos'
import { useMunicipios } from './use-municipios'
import { useSugestoesDeRua } from './use-sugestoes-de-rua'
import { validarBuscaReversa } from './validar-busca'

type EstadoInicial = {
  cep: string
  uf: string
  cidade: string
  rua: string
  resultado: CepResultado | null
  busca: BuscaReversa | null
  erro: string | null
}

type CepFormProps = {
  inicial: EstadoInicial
}

type Consulta = 'cep' | 'endereco' | null

const classeSelect =
  'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30 dark:scheme-dark'

const Rotulo = ({ children }: { children: ReactNode }) => (
  <span className="text-xs font-medium text-muted-foreground uppercase">
    {children}
  </span>
)

const camposDoResultado = (resultado: CepResultado) =>
  [
    { rotulo: 'CEP', valor: resultado.cep },
    { rotulo: 'Logradouro', valor: resultado.logradouro },
    { rotulo: 'Complemento', valor: resultado.complemento },
    { rotulo: 'Unidade', valor: resultado.unidade },
    { rotulo: 'Bairro', valor: resultado.bairro },
    { rotulo: 'Cidade', valor: resultado.cidade },
    { rotulo: 'Estado', valor: `${resultado.estado} (${resultado.uf})` },
    { rotulo: 'Região', valor: resultado.regiao },
    { rotulo: 'DDD', valor: resultado.ddd },
    { rotulo: 'Código IBGE', valor: resultado.ibge },
    { rotulo: 'Microrregião', valor: resultado.microrregiao ?? '' },
    { rotulo: 'Mesorregião', valor: resultado.mesorregiao ?? '' },
  ].filter((campo) => campo.valor.trim().length > 0)

const plural = (quantidade: number, singular: string, varios: string) =>
  `${quantidade} ${quantidade === 1 ? singular : varios}`

const CepForm = ({ inicial }: CepFormProps) => {
  const [cep, setCep] = useState(inicial.cep)
  const [uf, setUf] = useState(inicial.uf)
  const [cidade, setCidade] = useState(inicial.cidade)
  const [rua, setRua] = useState(inicial.rua)
  const [resultado, setResultado] = useState(inicial.resultado)
  const [busca, setBusca] = useState(inicial.busca)
  const [erro, setErro] = useState(inicial.erro)
  const [consultando, setConsultando] = useState<Consulta>(null)
  const campoCepRef = useRef<HTMLInputElement>(null)

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

  const limparResultados = () => {
    setResultado(null)
    setBusca(null)
  }

  const temAlgoParaLimpar =
    [cep, uf, cidade, rua].some((campo) => campo.length > 0) ||
    resultado !== null ||
    busca !== null ||
    erro !== null

  const limparTudo = () => {
    setCep('')
    setUf('')
    setCidade('')
    setRua('')
    setErro(null)
    limparResultados()
    window.history.replaceState(null, '', '/cep')
    campoCepRef.current?.focus()
  }

  const aoDigitarCep = (evento: ChangeEvent<HTMLInputElement>) => {
    const digitos = evento.target.value.replace(/\D/g, '').slice(0, 8)

    setCep(digitos.length > 5 ? formatarCep(digitos) : digitos)
  }

  const aoMudarUf = (novaUf: string) => {
    setUf(novaUf)
    setCidade('')
    setRua('')
  }

  const aoMudarCidade = (novaCidade: string) => {
    setCidade(novaCidade)
    setRua('')
  }

  const executar = async (tipo: Consulta, acao: () => Promise<void>) => {
    setConsultando(tipo)
    setErro(null)

    try {
      await acao()
    } catch {
      limparResultados()
      setErro('Não foi possível consultar agora. Tente de novo.')
    } finally {
      setConsultando(null)
    }
  }

  const consultarPorCep = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    const cepNormalizado = normalizarCep(cep)

    if (!cepNormalizado) {
      limparResultados()
      setErro('Informe um CEP com 8 dígitos.')
      return
    }

    void executar('cep', async () => {
      const resposta = await fetch(`/api/cep?cep=${cepNormalizado}`)
      const envelope = (await resposta.json()) as Envelope<CepResultado>

      limparResultados()

      if (envelope.ok) {
        setResultado(envelope.data)
        window.history.replaceState(null, '', `/cep/${cepNormalizado}`)
      } else {
        setErro(envelope.erro.mensagem)
      }
    })
  }

  const consultarPorEndereco = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    const invalido = validarBuscaReversa({
      uf,
      cidade: cidadeParaBusca,
      rua,
    })

    if (invalido) {
      limparResultados()
      setErro(invalido)
      return
    }

    void executar('endereco', async () => {
      const query = new URLSearchParams({
        uf,
        cidade: cidadeParaBusca,
        rua: rua.trim(),
      })
      const resposta = await fetch(`/api/cep?${query}`)
      const envelope = (await resposta.json()) as Envelope<BuscaReversa>

      limparResultados()

      if (envelope.ok) {
        setBusca(envelope.data)
        window.history.replaceState(null, '', `/cep?${query}`)
      } else {
        setErro(envelope.erro.mensagem)
      }
    })
  }

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

  const cepUnicoDaBusca =
    busca && busca.enderecos.every((endereco) => !endereco.logradouro)
      ? (busca.enderecos[0]?.cep ?? null)
      : null

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Por CEP</h2>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={limparTudo}
            disabled={!temAlgoParaLimpar || consultando !== null}
          >
            <EraserIcon className="size-4" />
            Limpar tudo
          </Button>
        </div>

        <form onSubmit={consultarPorCep} className="flex gap-2">
          <Input
            ref={campoCepRef}
            value={cep}
            onChange={aoDigitarCep}
            placeholder="01310-100"
            inputMode="numeric"
            autoComplete="postal-code"
            aria-label="CEP"
            autoFocus={!inicial.uf}
            className="max-w-40 font-mono"
          />

          <Button type="submit" disabled={consultando !== null}>
            <SearchIcon className="size-4" />
            {consultando === 'cep' ? 'Consultando…' : 'Consultar'}
          </Button>
        </form>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Pelo endereço</h2>

        <form
          onSubmit={consultarPorEndereco}
          className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.5fr)_auto]"
        >
          <label className="flex flex-col gap-1.5">
            <Rotulo>Estado</Rotulo>
            <select
              value={uf}
              onChange={(evento) => aoMudarUf(evento.target.value)}
              className={classeSelect}
            >
              <option value="">Selecione…</option>
              {ufs.map((estado) => (
                <option key={estado.sigla} value={estado.sigla}>
                  {estado.nome} ({estado.sigla})
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <Rotulo>Cidade / Município</Rotulo>
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
          </label>

          <label className="flex flex-col gap-1.5">
            <Rotulo>
              Rua{' '}
              <span className="normal-case">(mín. {MINIMO_TERMO} letras)</span>
            </Rotulo>
            <CampoSugestoes
              rotulo="Rua"
              valor={rua}
              aoMudar={setRua}
              aoEscolher={(sugestao) => setRua(sugestao.valor)}
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
          </label>

          <Button type="submit" disabled={consultando !== null}>
            <SearchIcon className="size-4" />
            {consultando === 'endereco' ? 'Consultando…' : 'Consultar'}
          </Button>
        </form>
      </section>

      {erro ? (
        <p
          role="status"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm"
        >
          {erro}
        </p>
      ) : null}

      {resultado ? (
        <div role="status" className="rounded-lg border px-4">
          {camposDoResultado(resultado).map((campo) => (
            <ValorCopiavel
              key={campo.rotulo}
              rotulo={campo.rotulo}
              valor={campo.valor}
            />
          ))}
        </div>
      ) : null}

      {cepUnicoDaBusca ? (
        <div role="status" className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Esta cidade não tem CEP por rua: todos os endereços usam o mesmo
            CEP.
          </p>
          <div className="rounded-lg border px-4">
            <ValorCopiavel
              rotulo="CEP único da cidade"
              valor={cepUnicoDaBusca}
            />
          </div>
        </div>
      ) : null}

      {busca && !cepUnicoDaBusca ? (
        <TabelaEnderecos busca={busca} uf={uf} cidade={cidadeParaBusca} />
      ) : null}
    </div>
  )
}

export { CepForm }
