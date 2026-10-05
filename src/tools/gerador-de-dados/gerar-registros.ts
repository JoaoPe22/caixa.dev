import {
  gerarEmpresa,
  gerarPessoa,
} from '@/shared/brasil/dados-ficticios/gerar'

import type { OpcoesGeracao, Registro } from './tipos'

const geradores = {
  pessoa: gerarPessoa,
  empresa: gerarEmpresa,
}

const gerarRegistros = ({
  entidade,
  quantidade,
  uf,
}: OpcoesGeracao): Registro[] =>
  Array.from({ length: quantidade }, () => geradores[entidade]({ uf }))

export { gerarRegistros }
