import { ChevronDownIcon, MapPinIcon } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { ValorCopiavel } from '@/components/valor-copiavel'
import { formatarCep } from '@/shared/brasil/cep'
import { formatarCnpj } from '@/shared/brasil/cnpj'
import { formatarData, formatarMoeda } from '@/shared/brasil/formatacao'
import { formatarTelefone } from '@/shared/brasil/telefone'

import { descreverOpcao, formatarCnae } from './formatacao'
import type { Empresa, Socio, Telefone } from './tipos'

type Campo = {
  rotulo: string
  valor: string
}

type SecaoProps = {
  titulo: string
  children: ReactNode
}

type SecaoDeCamposProps = {
  titulo: string
  campos: Campo[]
  rodape?: ReactNode
}

const Secao = ({ titulo, children }: SecaoProps) => (
  <section className="flex flex-col gap-2">
    <h3 className="text-sm font-semibold">{titulo}</h3>
    {children}
  </section>
)

const SecaoDeCampos = ({ titulo, campos, rodape }: SecaoDeCamposProps) => {
  const preenchidos = campos.filter((campo) => campo.valor.trim().length > 0)

  if (preenchidos.length === 0) {
    return null
  }

  return (
    <Secao titulo={titulo}>
      <div className="rounded-lg border px-4">
        {preenchidos.map((campo) => (
          <ValorCopiavel
            key={campo.rotulo}
            rotulo={campo.rotulo}
            valor={campo.valor}
          />
        ))}
      </div>
      {rodape}
    </Secao>
  )
}

const comData = (texto: string, prefixo: string, data: string) =>
  texto && data ? `${texto} ${prefixo} ${formatarData(data)}` : texto

const camposDeIdentificacao = (empresa: Empresa): Campo[] => [
  { rotulo: 'CNPJ', valor: formatarCnpj(empresa.cnpj) },
  { rotulo: 'Razão social', valor: empresa.razaoSocial },
  { rotulo: 'Nome fantasia', valor: empresa.nomeFantasia },
  {
    rotulo: 'Situação cadastral',
    valor: comData(empresa.situacao, 'desde', empresa.dataSituacao),
  },
  {
    rotulo: 'Motivo da situação',
    valor:
      empresa.motivoSituacao === 'SEM MOTIVO' ? '' : empresa.motivoSituacao,
  },
  {
    rotulo: 'Situação especial',
    valor: comData(
      empresa.situacaoEspecial,
      'desde',
      empresa.dataSituacaoEspecial,
    ),
  },
  { rotulo: 'Data de abertura', valor: formatarData(empresa.dataAbertura) },
  { rotulo: 'Natureza jurídica', valor: empresa.naturezaJuridica },
  { rotulo: 'Porte', valor: empresa.porte },
  {
    rotulo: 'Capital social',
    valor:
      empresa.capitalSocial === null
        ? ''
        : formatarMoeda(empresa.capitalSocial),
  },
]

const camposDeEndereco = ({ endereco }: Empresa): Campo[] => [
  {
    rotulo: 'Logradouro',
    valor: [endereco.logradouro, endereco.numero].filter(Boolean).join(', '),
  },
  { rotulo: 'Complemento', valor: endereco.complemento },
  { rotulo: 'Bairro', valor: endereco.bairro },
  { rotulo: 'CEP', valor: formatarCep(endereco.cep) },
  {
    rotulo: 'Município',
    valor: [endereco.municipio, endereco.uf].filter(Boolean).join(' / '),
  },
]

const rotuloDoTelefone = (telefones: Telefone[], indice: number) => {
  const fax = telefones[indice]?.fax ?? false
  const doMesmoTipo = telefones.filter((telefone) => telefone.fax === fax)
  const posicao = telefones
    .slice(0, indice + 1)
    .filter((telefone) => telefone.fax === fax).length
  const tipo = fax ? 'Fax' : 'Telefone'

  return doMesmoTipo.length > 1 ? `${tipo} ${posicao}` : tipo
}

const camposDeContato = ({ telefones, email }: Empresa): Campo[] => [
  ...telefones.map((telefone, indice) => ({
    rotulo: rotuloDoTelefone(telefones, indice),
    valor: formatarTelefone(telefone.numero),
  })),
  { rotulo: 'E-mail', valor: email },
]

const camposTributarios = (empresa: Empresa): Campo[] => [
  { rotulo: 'Simples Nacional', valor: descreverOpcao(empresa.simples) },
  { rotulo: 'MEI', valor: descreverOpcao(empresa.mei) },
]

const detalhesDoSocio = (socio: Socio) =>
  [
    socio.qualificacao,
    socio.dataEntrada ? `desde ${formatarData(socio.dataEntrada)}` : '',
    socio.faixaEtaria,
    socio.pais,
    socio.documento,
  ]
    .filter(Boolean)
    .join(' · ')

const Atividades = ({ empresa }: { empresa: Empresa }) => {
  const atividades = [
    ...(empresa.atividadePrincipal
      ? [{ ...empresa.atividadePrincipal, principal: true }]
      : []),
    ...empresa.atividadesSecundarias.map((atividade) => ({
      ...atividade,
      principal: false,
    })),
  ]

  if (atividades.length === 0) {
    return null
  }

  return (
    <Secao titulo="Atividades econômicas (CNAE)">
      <ul className="rounded-lg border">
        {atividades.map((atividade) => (
          <li
            key={atividade.codigo}
            className="flex gap-3 border-b px-4 py-2.5 last:border-b-0"
          >
            <span className="shrink-0 pt-0.5 font-mono text-xs">
              {formatarCnae(atividade.codigo)}
            </span>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm">
                {atividade.descricao || 'Descrição não informada'}
              </span>
              {atividade.principal ? (
                <span className="text-xs text-muted-foreground">Principal</span>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </Secao>
  )
}

const Socios = ({ socios }: { socios: Socio[] }) => {
  if (socios.length === 0) {
    return null
  }

  return (
    <details className="group rounded-lg border">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        Sócios e administradores ({socios.length})
        <ChevronDownIcon className="size-4 transition-transform group-open:rotate-180" />
      </summary>

      <ul className="border-t">
        {socios.map((socio, indice) => (
          <li
            key={`${socio.nome}-${indice}`}
            className="flex flex-col gap-0.5 border-b px-4 py-2.5 last:border-b-0"
          >
            <span className="text-sm font-medium">{socio.nome}</span>
            <span className="text-xs text-muted-foreground">
              {detalhesDoSocio(socio)}
            </span>
            {socio.representante ? (
              <span className="text-xs text-muted-foreground">
                Representante: {socio.representante.nome}
                {socio.representante.qualificacao
                  ? ` (${socio.representante.qualificacao})`
                  : ''}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </details>
  )
}

const ResultadoCnpj = ({ empresa }: { empresa: Empresa }) => {
  const ativa = empresa.situacao.toLowerCase() === 'ativa'
  const cep = empresa.endereco.cep

  return (
    <div role="status" className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={ativa ? 'secondary' : 'destructive'}>
            {empresa.situacao || 'Situação não informada'}
          </Badge>
          {empresa.matrizFilial ? (
            <Badge variant="outline">{empresa.matrizFilial}</Badge>
          ) : null}
          {empresa.mei.optante ? <Badge variant="outline">MEI</Badge> : null}
        </div>

        <h2 className="text-lg leading-tight font-semibold">
          {empresa.razaoSocial}
        </h2>

        {empresa.nomeFantasia ? (
          <p className="text-sm text-muted-foreground">
            {empresa.nomeFantasia}
          </p>
        ) : null}
      </header>

      <SecaoDeCampos
        titulo="Identificação"
        campos={camposDeIdentificacao(empresa)}
      />

      <Atividades empresa={empresa} />

      <SecaoDeCampos
        titulo="Endereço"
        campos={camposDeEndereco(empresa)}
        rodape={
          /^\d{8}$/.test(cep) ? (
            <Link
              href={`/cep/${cep}`}
              className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <MapPinIcon className="size-3.5" />
              Consultar este CEP
            </Link>
          ) : null
        }
      />

      <SecaoDeCampos titulo="Contato" campos={camposDeContato(empresa)} />

      <SecaoDeCampos
        titulo="Regime tributário"
        campos={camposTributarios(empresa)}
      />

      <Socios socios={empresa.socios} />
    </div>
  )
}

export { ResultadoCnpj }
