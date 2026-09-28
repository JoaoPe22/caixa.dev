import { formatarCnpj, normalizarCnpj } from '@/shared/brasil/cnpj'
import { LimiteExcedidoError } from '@/tools/_core/limite-de-taxa'
import type { ToolProps } from '@/tools/_core/types'

import { CnpjForm } from './cnpj-form'
import {
  MENSAGEM_CNPJ_INVALIDO,
  MENSAGEM_CNPJ_NAO_ENCONTRADO,
} from './constantes'
import { consultarCnpj } from './consultar-cnpj'
import type { Empresa } from './empresa'

const mensagemDeFalha = (falha: unknown) =>
  falha instanceof LimiteExcedidoError
    ? falha.message
    : 'Não foi possível consultar agora. Tente de novo.'

const CnpjTool = async ({ args }: ToolProps) => {
  const bruto = args.join('')

  if (!bruto) {
    return <CnpjForm inicial={{ cnpj: '', empresa: null, erro: null }} />
  }

  const cnpj = normalizarCnpj(bruto)

  if (!cnpj) {
    return (
      <CnpjForm
        inicial={{
          cnpj: formatarCnpj(bruto),
          empresa: null,
          erro: MENSAGEM_CNPJ_INVALIDO,
        }}
      />
    )
  }

  let empresa: Empresa | null = null
  let erro: string | null = null

  try {
    empresa = await consultarCnpj(cnpj)

    if (!empresa) {
      erro = MENSAGEM_CNPJ_NAO_ENCONTRADO
    }
  } catch (falha) {
    erro = mensagemDeFalha(falha)
  }

  return <CnpjForm inicial={{ cnpj: formatarCnpj(cnpj), empresa, erro }} />
}

export default CnpjTool
