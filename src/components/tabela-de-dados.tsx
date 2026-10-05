import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type TabelaDeDadosProps = {
  cabecalho: readonly string[]
  linhas: readonly (readonly string[])[]
}

const TabelaDeDados = ({ cabecalho, linhas }: TabelaDeDadosProps) => (
  <div className="rounded-lg border">
    <Table>
      <TableHeader className="bg-muted/40">
        <TableRow className="hover:bg-transparent">
          {cabecalho.map((titulo) => (
            <TableHead
              key={titulo}
              className="px-3 text-xs text-muted-foreground uppercase"
            >
              {titulo}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {linhas.map((linha, indiceLinha) => (
          <TableRow key={indiceLinha}>
            {linha.map((valor, indiceColuna) => (
              <TableCell
                key={cabecalho[indiceColuna] ?? indiceColuna}
                className="px-3"
              >
                {valor}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)

export { TabelaDeDados }
