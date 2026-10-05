'use client'

import { EraserIcon, SearchIcon } from 'lucide-react'
import type { ChangeEvent, FormEvent } from 'react'
import { useRef, useState } from 'react'

import { Alerta } from '@/components/alerta'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ItemGroup } from '@/components/ui/item'
import { ValorCopiavel } from '@/components/valor-copiavel'
import { formatarCep, normalizarCep } from '@/shared/brasil/cep'
import { consultarApi } from '@/tools/_core/cliente-api'

import { MENSAGEM_CEP_INVALIDO } from './constantes'
import { FormPorEndereco } from './form-por-endereco'
import { TabelaEnderecos } from './tabela-enderecos'
import type { BuscaReversa, CepResultado } from './tipos'
import type { BuscaReversaEntrada } from './validar-busca'
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

  const consultar = async <T,>(
    tipo: Consulta,
    url: string,
    aplicar: (dados: T) => void,
    enderecoDaPagina: string,
  ) => {
    setConsultando(tipo)
    setErro(null)

    const envelope = await consultarApi<T>(url)

    setConsultando(null)
    limparResultados()

    if (envelope.ok) {
      aplicar(envelope.data)
      window.history.replaceState(null, '', enderecoDaPagina)
    } else {
      setErro(envelope.erro.mensagem)
    }
  }

  const consultarPorCep = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    const cepNormalizado = normalizarCep(cep)

    if (!cepNormalizado) {
      limparResultados()
      setErro(MENSAGEM_CEP_INVALIDO)
      return
    }

    void consultar<CepResultado>(
      'cep',
      `/api/cep?cep=${cepNormalizado}`,
      setResultado,
      `/cep/${cepNormalizado}`,
    )
  }

  const consultarPorEndereco = (entrada: BuscaReversaEntrada) => {
    const invalido = validarBuscaReversa(entrada)

    if (invalido) {
      limparResultados()
      setErro(invalido)
      return
    }

    const query = new URLSearchParams({
      uf: entrada.uf,
      cidade: entrada.cidade,
      rua: entrada.rua.trim(),
    })

    void consultar<BuscaReversa>(
      'endereco',
      `/api/cep?${query}`,
      setBusca,
      `/cep?${query}`,
    )
  }

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

        <FormPorEndereco
          uf={uf}
          cidade={cidade}
          rua={rua}
          aoMudarUf={aoMudarUf}
          aoMudarCidade={aoMudarCidade}
          aoMudarRua={setRua}
          aoConsultar={consultarPorEndereco}
          consultando={consultando === 'endereco'}
          desabilitado={consultando !== null}
        />
      </section>

      {erro ? <Alerta>{erro}</Alerta> : null}

      {resultado ? (
        <div role="status">
          <ItemGroup variant="outline">
            {camposDoResultado(resultado).map((campo) => (
              <ValorCopiavel
                key={campo.rotulo}
                rotulo={campo.rotulo}
                valor={campo.valor}
              />
            ))}
          </ItemGroup>
        </div>
      ) : null}

      {cepUnicoDaBusca ? (
        <div role="status" className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Esta cidade não tem CEP por rua: todos os endereços usam o mesmo
            CEP.
          </p>
          <ItemGroup variant="outline">
            <ValorCopiavel
              rotulo="CEP único da cidade"
              valor={cepUnicoDaBusca}
            />
          </ItemGroup>
        </div>
      ) : null}

      {busca && !cepUnicoDaBusca ? <TabelaEnderecos busca={busca} /> : null}
    </div>
  )
}

export { CepForm }
