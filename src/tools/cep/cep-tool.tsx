import type { ToolProps, ToolSearchParams } from '@/tools/_core/types'

import { CepForm } from './cep-form'
import type { BuscaReversa, CepResultado } from './consultar-cep'
import { buscarEnderecos, consultarCep } from './consultar-cep'
import { formatarCep, normalizarCep } from './normalizar-cep'
import { validarBuscaReversa } from './validar-busca'

const texto = (params: ToolSearchParams, chave: string) => {
  const valor = params[chave]

  return (Array.isArray(valor) ? (valor[0] ?? '') : (valor ?? '')).trim()
}

const CepTool = async ({ args, searchParams }: ToolProps) => {
  const uf = texto(searchParams, 'uf').toUpperCase()
  const cidade = texto(searchParams, 'cidade')
  const rua = texto(searchParams, 'rua')

  if (uf || cidade || rua) {
    let busca: BuscaReversa | null = null
    let erro = validarBuscaReversa({ uf, cidade, rua })

    if (!erro) {
      try {
        const encontrado = await buscarEnderecos(uf, cidade, rua)

        if (encontrado.enderecos.length === 0) {
          erro = `Nenhum endereço encontrado para "${rua}" em ${cidade}.`
        } else {
          busca = encontrado
        }
      } catch {
        erro = 'Não foi possível consultar agora. Tente de novo.'
      }
    }

    return (
      <CepForm
        inicial={{ cep: '', uf, cidade, rua, resultado: null, busca, erro }}
      />
    )
  }

  const bruto = args[0] ?? ''
  const cep = bruto ? normalizarCep(bruto) : null

  if (!cep) {
    return (
      <CepForm
        inicial={{
          cep: bruto,
          uf: '',
          cidade: '',
          rua: '',
          resultado: null,
          busca: null,
          erro: bruto ? 'Informe um CEP com 8 dígitos.' : null,
        }}
      />
    )
  }

  let resultado: CepResultado | null = null
  let erro: string | null = null

  try {
    resultado = await consultarCep(cep)

    if (!resultado) {
      erro = 'CEP não encontrado.'
    }
  } catch {
    erro = 'Não foi possível consultar agora. Tente de novo.'
  }

  return (
    <CepForm
      inicial={{
        cep: formatarCep(cep),
        uf: '',
        cidade: '',
        rua: '',
        resultado,
        busca: null,
        erro,
      }}
    />
  )
}

export default CepTool
