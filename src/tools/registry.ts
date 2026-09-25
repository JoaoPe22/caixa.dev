import { slugReservado } from './_core/slugs-reservados'
import type { ToolEntrada, ToolManifest } from './_core/types'
import { cepManifest } from './cep/manifest'
import { qrcodeManifest } from './qrcode/manifest'

const tools: ToolEntrada[] = [
  { manifest: cepManifest, carregar: () => import('./cep/cep-tool') },
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
