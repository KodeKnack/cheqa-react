'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({ theme: 'light', toggleTheme: () => {} })

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('cheqa-theme') as Theme | null
  if (saved === 'light' || saved === 'dark') return saved
  if (document.documentElement.classList.contains('dark')) return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const saved = localStorage.getItem('cheqa-theme') as Theme | null
    if (saved === 'light' || saved === 'dark') return
    const systemPrefers = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    setTheme(systemPrefers)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('cheqa-theme', newTheme)
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
