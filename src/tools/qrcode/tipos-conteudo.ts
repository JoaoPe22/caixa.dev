import {
  AlignLeftIcon,
  BanknoteIcon,
  CalendarDaysIcon,
  ContactIcon,
  LinkIcon,
  type LucideIcon,
  MailIcon,
  MessageCircleIcon,
  MessageSquareTextIcon,
  PhoneIcon,
  WifiIcon,
} from 'lucide-react'

import type { TipoChavePix } from '@/shared/brasil/pix'

type TipoConteudo =
  | 'link'
  | 'texto'
  | 'email'
  | 'ligacao'
  | 'sms'
  | 'whatsapp'
  | 'wifi'
  | 'vcard'
  | 'evento'
  | 'pix'

type SegurancaWifi = 'WPA' | 'WEP' | 'nopass'

type DadosConteudo = {
  link: { url: string }
  texto: { texto: string }
  email: { para: string; assunto: string; mensagem: string }
  ligacao: { telefone: string }
  sms: { telefone: string; mensagem: string }
  whatsapp: { telefone: string; mensagem: string }
  wifi: {
    rede: string
    senha: string
    seguranca: SegurancaWifi
    oculta: boolean
  }
  vcard: {
    nome: string
    sobrenome: string
    telefone: string
    email: string
    empresa: string
    cargo: string
    site: string
  }
  evento: {
    titulo: string
    local: string
    inicio: string
    fim: string
    descricao: string
  }
  pix: {
    tipoChave: TipoChavePix
    chave: string
    nome: string
    cidade: string
    valor: string
    identificador: string
  }
}

const tiposDeConteudo: {
  id: TipoConteudo
  rotulo: string
  icone: LucideIcon
}[] = [
  { id: 'link', rotulo: 'Link', icone: LinkIcon },
  { id: 'texto', rotulo: 'Texto', icone: AlignLeftIcon },
  { id: 'email', rotulo: 'E-mail', icone: MailIcon },
  { id: 'ligacao', rotulo: 'Ligação', icone: PhoneIcon },
  { id: 'sms', rotulo: 'SMS', icone: MessageSquareTextIcon },
  { id: 'whatsapp', rotulo: 'WhatsApp', icone: MessageCircleIcon },
  { id: 'wifi', rotulo: 'Wi-Fi', icone: WifiIcon },
  { id: 'vcard', rotulo: 'vCard', icone: ContactIcon },
  { id: 'evento', rotulo: 'Evento', icone: CalendarDaysIcon },
  { id: 'pix', rotulo: 'Pix', icone: BanknoteIcon },
]

const dadosIniciais: DadosConteudo = {
  link: { url: '' },
  texto: { texto: '' },
  email: { para: '', assunto: '', mensagem: '' },
  ligacao: { telefone: '' },
  sms: { telefone: '', mensagem: '' },
  whatsapp: { telefone: '', mensagem: '' },
  wifi: { rede: '', senha: '', seguranca: 'WPA', oculta: false },
  vcard: {
    nome: '',
    sobrenome: '',
    telefone: '',
    email: '',
    empresa: '',
    cargo: '',
    site: '',
  },
  evento: { titulo: '', local: '', inicio: '', fim: '', descricao: '' },
  pix: {
    tipoChave: 'cpf',
    chave: '',
    nome: '',
    cidade: '',
    valor: '',
    identificador: '',
  },
}

export { dadosIniciais, tiposDeConteudo }
export type { DadosConteudo, SegurancaWifi, TipoConteudo }
