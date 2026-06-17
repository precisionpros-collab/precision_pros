'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

function getDefaultTheme(): 'light' | 'dark' {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 18 ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={getDefaultTheme()}
      enableSystem={false}
      storageKey="precisionpros-theme"
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}
