import { QrCodeIcon } from 'lucide-react'

import type { ToolManifest } from '@/tools/_core/types'

const qrcodeManifest: ToolManifest = {
  slug: 'qrcode',
  nome: 'Gerador de QR Code',
  descricao:
    'QR Code de link, Wi-Fi, WhatsApp, Pix e mais, com cores, formatos, logo e moldura.',
  categoria: 'dados',
  tags: [
    'qr',
    'qrcode',
    'qr code',
    'gerador',
    'link',
    'wifi',
    'whatsapp',
    'pix',
    'vcard',
    'evento',
  ],
  icone: QrCodeIcon,
  runtime: 'client',
}

export { qrcodeManifest }
