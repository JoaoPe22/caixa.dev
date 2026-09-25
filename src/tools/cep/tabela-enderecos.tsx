'use client'

import { DownloadIcon } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { LIMITE_VIACEP } from './constantes'
import type { BuscaReversa } from './consultar-cep'
import { gerarCsv } from './gerar-csv'
import { normalizarCep } from './normalizar-cep'

type TabelaEnderecosProps = {
  busca: BuscaReversa
  uf: string
  cidade: string
}

const TabelaEnderecos = ({ busca, uf, cidade }: TabelaEnderecosProps) => {
  const [filtro, setFiltro] = useState('')

  const visiveis = useMemo(() => {
    const alvo = filtro.trim().toLowerCase()

    if (!alvo) {
      return busca.enderecos
    }

    return busca.enderecos.filter((endereco) =>
      [
        endereco.cep,
        endereco.logradouro,
        endereco.complemento,
        endereco.bairro,
        endereco.cidade,
      ].some((campo) => campo.toLowerCase().includes(alvo)),
    )
  }, [busca.enderecos, filtro])

  const baixarCsv = () => {
    const blob = new Blob([gerarCsv(visiveis)], {
      type: 'text/csv;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `cep-${uf}-${cidade}.csv`.replace(/\s+/g, '-').toLowerCase()
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          value={filtro}
          onChange={(evento) => setFiltro(evento.target.value)}
          placeholder="Filtrar por bairro, complemento…"
          aria-label="Filtrar resultados"
          className="max-w-72"
        />

        <Button variant="outline" size="sm" onClick={baixarCsv}>
          <DownloadIcon className="size-4" />
          Baixar CSV
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {visiveis.length} de {busca.enderecos.length} exibidos
        {busca.truncado ? (
          <span className="text-amber-600 dark:text-amber-500">
            {' '}
            — o ViaCEP corta em {LIMITE_VIACEP} e não pagina. Refine a rua para
            ver o resto.
          </span>
        ) : null}
      </p>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left">
            <tr className="text-xs text-muted-foreground uppercase">
              <th className="px-3 py-2 font-medium">CEP</th>
              <th className="px-3 py-2 font-medium">Logradouro</th>
              <th className="px-3 py-2 font-medium">Complemento</th>
              <th className="px-3 py-2 font-medium">Bairro</th>
              <th className="px-3 py-2 font-medium">Cidade</th>
              <th className="px-3 py-2 font-medium">UF</th>
              <th className="px-3 py-2 font-medium">DDD</th>
            </tr>
          </thead>

          <tbody>
            {visiveis.map((endereco) => (
              <tr key={endereco.cep} className="border-b last:border-b-0">
                <td className="px-3 py-2 font-mono whitespace-nowrap">
                  <Link
                    href={`/cep/${normalizarCep(endereco.cep) ?? endereco.cep}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {endereco.cep}
                  </Link>
                </td>
                <td className="px-3 py-2">{endereco.logradouro}</td>
                <td className="px-3 py-2 text-muted-foreground">
                  {endereco.complemento}
                </td>
                <td className="px-3 py-2">{endereco.bairro}</td>
                <td className="px-3 py-2">{endereco.cidade}</td>
                <td className="px-3 py-2">{endereco.uf}</td>
                <td className="px-3 py-2">{endereco.ddd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visiveis.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum resultado para esse filtro.
        </p>
      ) : null}
    </div>
  )
}

export { TabelaEnderecos }
