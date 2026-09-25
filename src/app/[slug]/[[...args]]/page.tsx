import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getToolBySlug, manifests } from '@/tools/registry'

type Props = PageProps<'/[slug]/[[...args]]'>

const generateStaticParams = async () =>
  manifests().map((manifest) => ({ slug: manifest.slug, args: [] }))

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const entrada = getToolBySlug(slug)

  if (!entrada) {
    return {}
  }

  return {
    title: entrada.manifest.nome,
    description: entrada.manifest.descricao,
  }
}

const ToolPage = async ({ params, searchParams }: Props) => {
  const { slug, args } = await params
  const entrada = getToolBySlug(slug)

  if (!entrada) {
    notFound()
  }

  const [query, { default: Tool }] = await Promise.all([
    searchParams,
    entrada.carregar(),
  ])

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {entrada.manifest.nome}
        </h1>
        <p className="text-sm text-muted-foreground">
          {entrada.manifest.descricao}
        </p>
      </header>

      <Tool args={args ?? []} searchParams={query} />
    </article>
  )
}

export { generateMetadata, generateStaticParams }
export default ToolPage
