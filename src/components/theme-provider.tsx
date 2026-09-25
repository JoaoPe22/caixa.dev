'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => (
  <NextThemesProvider {...props}>{children}</NextThemesProvider>
)

export { ThemeProvider }
export type { ThemeProviderProps }
