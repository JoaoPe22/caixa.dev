import './globals.css'

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'

import { CommandPalette } from '@/components/command-palette'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { manifests } from '@/tools/registry'

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const metadata: Metadata = {
  title: {
    default: 'caixa.dev — ferramentas rápidas',
    template: '%s · caixa.dev',
  },
  description:
    'Caixa de ferramentas rápidas para consultas do dia a dia. Sem login, sem anúncios, sem espera.',
}

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

const RootLayout = ({ children }: LayoutProps<'/'>) => (
  <html
    lang="pt-BR"
    suppressHydrationWarning
    className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
  >
    <body className="flex min-h-full flex-col">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <header className="border-b">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-70"
            >
              caixa<span className="text-muted-foreground">.dev</span>
            </Link>
            <div className="flex items-center gap-2">
              <CommandPalette itens={itensDaPalette()} />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
          {children}
        </main>

        <footer className="border-t">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 text-sm text-muted-foreground">
            Ferramentas rápidas, sem login e sem anúncios.
          </div>
        </footer>
      </ThemeProvider>
    </body>
  </html>
)

export { metadata }
export default RootLayout
