'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider
} from 'next-themes'

interface CustomThemeProviderProps {
  children: React.ReactNode
  // Add any other props you want to support
}

export function ThemeProvider({ children, ...props }: CustomThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
