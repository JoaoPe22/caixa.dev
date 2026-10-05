'use client'

import { DownloadIcon } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { Alerta } from '@/components/alerta'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { baixarArquivo } from '@/lib/baixar-arquivo'
import { normalizarTexto } from '@/lib/texto'
import { normalizarCep } from '@/shared/brasil/cep'

import { LIMITE_VIACEP } from './constantes'
import { gerarCsvEnderecos } from './gerar-csv'
import type { BuscaReversa } from './tipos'

type TabelaEnderecosProps = {
  busca: BuscaReversa
}

const colunas = [
  'CEP',
  'Logradouro',
  'Complemento',
  'Bairro',
  'Cidade',
  'UF',
  'DDD',
]

const TabelaEnderecos = ({ busca }: TabelaEnderecosProps) => {
  const [filtro, setFiltro] = useState('')

  const visiveis = useMemo(() => {
    const alvo = normalizarTexto(filtro)

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
      ].some((campo) => normalizarTexto(campo).includes(alvo)),
    )
  }, [busca.enderecos, filtro])

  const baixarCsv = () => {
    const referencia = busca.enderecos[0]

    baixarArquivo(
      new Blob([gerarCsvEnderecos(visiveis)], {
        type: 'text/csv;charset=utf-8',
      }),
      `cep-${referencia?.uf ?? ''}-${referencia?.cidade ?? ''}.csv`
        .replace(/\s+/g, '-')
        .toLowerCase(),
    )
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
      </p>

      {busca.truncado ? (
        <Alerta variante="aviso">
          O ViaCEP corta em {LIMITE_VIACEP} e não pagina. Refine a rua para ver
          o resto.
        </Alerta>
      ) : null}

      <div className="rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="text-xs uppercase hover:bg-transparent">
              {colunas.map((coluna) => (
                <TableHead key={coluna} className="px-3 text-muted-foreground">
                  {coluna}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {visiveis.map((endereco) => (
              <TableRow key={endereco.cep}>
                <TableCell className="px-3 font-mono">
                  <Link
                    href={`/cep/${normalizarCep(endereco.cep) ?? endereco.cep}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {endereco.cep}
                  </Link>
                </TableCell>
                <TableCell className="px-3 whitespace-normal">
                  {endereco.logradouro}
                </TableCell>
                <TableCell className="px-3 whitespace-normal text-muted-foreground">
                  {endereco.complemento}
                </TableCell>
                <TableCell className="px-3 whitespace-normal">
                  {endereco.bairro}
                </TableCell>
                <TableCell className="px-3 whitespace-normal">
                  {endereco.cidade}
                </TableCell>
                <TableCell className="px-3">{endereco.uf}</TableCell>
                <TableCell className="px-3">{endereco.ddd}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
