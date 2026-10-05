type Ramo = {
  atividade: string
  fantasia: string
}

const nucleosDeNome = [
  'Aurora',
  'Horizonte',
  'Primavera',
  'Estrela',
  'Atlântico',
  'Cerrado',
  'Pantanal',
  'Ipê',
  'Jequitibá',
  'Alvorada',
  'Nova Era',
  'Bandeirante',
  'Serra Azul',
  'Vale Verde',
  'Rio Claro',
  'Porto Seguro',
  'Sol Nascente',
  'Três Irmãos',
]

const ramos: Ramo[] = [
  { atividade: 'Comércio de Alimentos', fantasia: 'Alimentos' },
  { atividade: 'Comércio de Materiais de Construção', fantasia: 'Materiais' },
  { atividade: 'Comércio de Roupas', fantasia: 'Modas' },
  { atividade: 'Comércio de Autopeças', fantasia: 'Autopeças' },
  { atividade: 'Serviços de Tecnologia', fantasia: 'Tecnologia' },
  { atividade: 'Serviços Contábeis', fantasia: 'Contabilidade' },
  { atividade: 'Serviços de Limpeza', fantasia: 'Limpeza' },
  { atividade: 'Transportes', fantasia: 'Transportes' },
  { atividade: 'Logística', fantasia: 'Logística' },
  { atividade: 'Indústria Metalúrgica', fantasia: 'Metalúrgica' },
  { atividade: 'Indústria de Móveis', fantasia: 'Móveis' },
  { atividade: 'Engenharia', fantasia: 'Engenharia' },
  { atividade: 'Consultoria Empresarial', fantasia: 'Consultoria' },
  { atividade: 'Clínica Médica', fantasia: 'Saúde' },
  { atividade: 'Farmácia e Drogaria', fantasia: 'Farma' },
  { atividade: 'Padaria e Confeitaria', fantasia: 'Pães' },
  { atividade: 'Restaurante', fantasia: 'Restaurante' },
  { atividade: 'Agropecuária', fantasia: 'Agro' },
]

const naturezas = ['LTDA', 'LTDA', 'LTDA', 'S.A.', 'SLU']

export { naturezas, nucleosDeNome, ramos }
export type { Ramo }
