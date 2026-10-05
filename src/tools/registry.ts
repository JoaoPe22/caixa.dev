import { slugReservado } from './_core/slugs-reservados'
import type { ToolEntrada, ToolManifest } from './_core/types'
import { cepManifest } from './cep/manifest'
import { cnpjManifest } from './cnpj/manifest'
import { geradorDeCnpjManifest } from './gerador-de-cnpj/manifest'
import { geradorDeCpfManifest } from './gerador-de-cpf/manifest'
import { geradorDeDadosManifest } from './gerador-de-dados/manifest'
import { qrcodeManifest } from './qrcode/manifest'

const tools: ToolEntrada[] = [
  { manifest: cepManifest, carregar: () => import('./cep/cep-tool') },
  { manifest: cnpjManifest, carregar: () => import('./cnpj/cnpj-tool') },
  {
    manifest: geradorDeCnpjManifest,
    carregar: () => import('./gerador-de-cnpj/gerador-de-cnpj-tool'),
  },
  {
    manifest: geradorDeCpfManifest,
    carregar: () => import('./gerador-de-cpf/gerador-de-cpf-tool'),
  },
  {
    manifest: geradorDeDadosManifest,
    carregar: () => import('./gerador-de-dados/gerador-de-dados-tool'),
  },
  { manifest: qrcodeManifest, carregar: () => import('./qrcode/qrcode-tool') },
]

const validarSlugs = (entradas: ToolEntrada[]) => {
  const slugs = entradas.map((entrada) => entrada.manifest.slug)
  const reservados = slugs.filter(slugReservado)
  const duplicados = slugs.filter(
    (slug, indice) => slugs.indexOf(slug) !== indice,
  )

  if (reservados.length > 0) {
    throw new Error(
      `Slugs reservados pelo sistema usados por ferramentas: ${reservados.join(', ')}`,
    )
  }

  if (duplicados.length > 0) {
    throw new Error(`Slugs duplicados no registry: ${duplicados.join(', ')}`)
  }
}

validarSlugs(tools)

const manifests = (): ToolManifest[] => tools.map((entrada) => entrada.manifest)

const getToolBySlug = (slug: string): ToolEntrada | undefined =>
  tools.find((entrada) => entrada.manifest.slug === slug)

export { getToolBySlug, manifests }
