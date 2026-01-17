'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-400" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
      aria-label="Toggle theme"
      type="button"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 transition-all duration-200 rotate-0 opacity-100" />
      ) : (
        <Moon className="h-5 w-5 transition-all duration-200 -rotate-90 opacity-100" />
      )}
    </button>
  )
}
