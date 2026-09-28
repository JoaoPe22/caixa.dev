import { z } from 'zod'

import { interpretarNumero } from '@/shared/brasil/numero'
import { buscarJson } from '@/tools/_core/api-helpers'
import { ErroUpstream } from '@/tools/_core/erros'

import { REVALIDATE_CNPJ } from '../constantes'
import { mascararCpfNoTexto } from '../mascarar-cpf'
import type { Atividade, Empresa, OpcaoTributaria } from '../tipos'

const texto = z
  .string()
  .nullish()
  .transform((valor) => valor?.trim() ?? '')

const codigoDescricao = z
  .object({ codigo: texto, descricao: texto })
  .nullish()
  .transform((valor) => valor ?? { codigo: '', descricao: '' })

const openCnpjSchema = z.object({
  cnpj: z.string(),
  razao_social: texto,
  nome_fantasia: texto,
  situacao_cadastral: texto,
  data_situacao_cadastral: texto,
  motivo_situacao_cadastral: codigoDescricao,
  situacao_especial: texto,
  data_situacao_especial: texto,
  matriz_filial: texto,
  data_inicio_atividade: texto,
  cnae_principal: texto,
  cnaes: z
    .array(
      z.object({
        codigo: texto,
        descricao: texto,
        is_principal: z.boolean().nullish(),
      }),
    )
    .nullish(),
  natureza_juridica: texto,
  tipo_logradouro: texto,
  logradouro: texto,
  numero: texto,
  complemento: texto,
  bairro: texto,
  cep: texto,
  uf: texto,
  municipio: texto,
  email: texto,
  telefones: z
    .array(
      z.object({ ddd: texto, numero: texto, is_fax: z.boolean().nullish() }),
    )
    .nullish(),
  capital_social: texto,
  porte_empresa: texto,
  opcao_simples: texto,
  data_opcao_simples: texto,
  data_exclusao_simples: texto,
  opcao_mei: texto,
  data_opcao_mei: texto,
  data_exclusao_mei: texto,
  QSA: z
    .array(
      z.object({
        nome_socio: texto,
        cnpj_cpf_socio: texto,
        qualificacao_socio: texto,
        data_entrada_sociedade: texto,
        identificador_socio: texto,
        pais: codigoDescricao,
        nome_representante: texto,
        qualificacao_representante: codigoDescricao,
        faixa_etaria: texto,
      }),
    )
    .nullish(),
})

type OpenCnpj = z.infer<typeof openCnpjSchema>

const paraOpcao = (
  opcao: string,
  dataOpcao: string,
  dataExclusao: string,
): OpcaoTributaria => ({
  optante: opcao === 'S' ? true : opcao === 'N' ? false : null,
  dataOpcao,
  dataExclusao,
})

const paraAtividade = ({ codigo, descricao }: Atividade): Atividade => ({
  codigo,
  descricao,
})

const paraAtividades = (bruto: OpenCnpj) => {
  const cnaes = bruto.cnaes ?? []
  const principal = cnaes.find((cnae) => cnae.is_principal)

  return {
    principal: principal
      ? paraAtividade(principal)
      : bruto.cnae_principal
        ? { codigo: bruto.cnae_principal, descricao: '' }
        : null,
    secundarias: cnaes.filter((cnae) => !cnae.is_principal).map(paraAtividade),
  }
}

const paraEmpresa = (bruto: OpenCnpj): Empresa => {
  const atividades = paraAtividades(bruto)

  return {
    cnpj: bruto.cnpj,
    razaoSocial: mascararCpfNoTexto(bruto.razao_social),
    nomeFantasia: mascararCpfNoTexto(bruto.nome_fantasia),
    situacao: bruto.situacao_cadastral,
    dataSituacao: bruto.data_situacao_cadastral,
    motivoSituacao: bruto.motivo_situacao_cadastral.descricao,
    situacaoEspecial: bruto.situacao_especial,
    dataSituacaoEspecial: bruto.data_situacao_especial,
    matrizFilial: bruto.matriz_filial,
    dataAbertura: bruto.data_inicio_atividade,
    naturezaJuridica: bruto.natureza_juridica,
    porte: bruto.porte_empresa,
    capitalSocial: interpretarNumero(bruto.capital_social),
    atividadePrincipal: atividades.principal,
    atividadesSecundarias: atividades.secundarias,
    endereco: {
      logradouro: [bruto.tipo_logradouro, bruto.logradouro]
        .filter(Boolean)
        .join(' '),
      numero: bruto.numero,
      complemento: bruto.complemento.replace(/\s{2,}/g, ' '),
      bairro: bruto.bairro,
      cep: bruto.cep,
      municipio: bruto.municipio,
      uf: bruto.uf,
    },
    telefones: (bruto.telefones ?? [])
      .filter((telefone) => telefone.numero)
      .map((telefone) => ({
        numero: `${telefone.ddd}${telefone.numero}`,
        fax: telefone.is_fax === true,
      })),
    email: bruto.email.toLowerCase(),
    simples: paraOpcao(
      bruto.opcao_simples,
      bruto.data_opcao_simples,
      bruto.data_exclusao_simples,
    ),
    mei: paraOpcao(
      bruto.opcao_mei,
      bruto.data_opcao_mei,
      bruto.data_exclusao_mei,
    ),
    socios: (bruto.QSA ?? []).map((socio) => ({
      nome: socio.nome_socio,
      documento: socio.cnpj_cpf_socio,
      tipo: socio.identificador_socio,
      qualificacao: socio.qualificacao_socio,
      dataEntrada: socio.data_entrada_sociedade,
      faixaEtaria: socio.faixa_etaria,
      pais: socio.pais.descricao,
      representante: socio.nome_representante
        ? {
            nome: socio.nome_representante,
            qualificacao: socio.qualificacao_representante.descricao,
          }
        : null,
    })),
  }
}

const buscarNaOpenCnpj = async (cnpj: string): Promise<Empresa | null> => {
  try {
    const bruto = await buscarJson(`https://api.opencnpj.org/${cnpj}`, {
      servico: 'opencnpj',
      revalidate: REVALIDATE_CNPJ,
      schema: openCnpjSchema,
    })

    return paraEmpresa(bruto)
  } catch (erro) {
    if (erro instanceof ErroUpstream && erro.status === 404) {
      return null
    }

    throw erro
  }
}

export { buscarNaOpenCnpj }
