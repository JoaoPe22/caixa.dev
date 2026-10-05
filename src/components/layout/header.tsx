import Link from 'next/link'

import { CommandPalette, type PaletteItem } from '@/components/command-palette'
import { ThemeToggle } from '@/components/theme-toggle'

type HeaderProps = {
  itens: PaletteItem[]
}

const Header = ({ itens }: HeaderProps) => (
  <header className="border-b">
    <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
      <Link
        href="/"
        className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-70"
      >
        caixa<span className="text-muted-foreground">.dev</span>
      </Link>
      <div className="flex items-center gap-2">
        <CommandPalette itens={itens} />
        <ThemeToggle />
      </div>
    </div>
  </header>
)

export { Header }
