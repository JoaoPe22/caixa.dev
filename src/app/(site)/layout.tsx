import React from 'react'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { MotionProvider } from '@/components/layout/motion-provider'
import { manifests } from '@/tools/registry'

const itensDaPalette = () =>
  manifests().map((manifest) => {
    const Icone = manifest.icone

    return {
      slug: manifest.slug,
      nome: manifest.nome,
      descricao: manifest.descricao,
      tags: manifest.tags,
      icone: <Icone className="size-4" />,
      aceitaArgumento: manifest.aceitaArgumento ?? false,
    }
  })

const SitePage = ({ children }: { children: React.ReactNode }) => {
  return (
    <MotionProvider>
      <Header itens={itensDaPalette()} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        {children}
      </main>
      <Footer />
    </MotionProvider>
  )
}

export default SitePage
