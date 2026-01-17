'use client'

import { ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 sm:bottom-6"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  )
}
