'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()

  const alternar = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={alternar}
      aria-label="Alternar entre tema claro e escuro"
    >
      <SunIcon className="hidden size-4 dark:block" />
      <MoonIcon className="size-4 dark:hidden" />
    </Button>
  )
}

export { ThemeToggle }
