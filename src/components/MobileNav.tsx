'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CreditCard, Tag, Receipt } from 'lucide-react'

export default function MobileNav() {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/expenses', icon: Receipt, label: 'Expenses' },
    { href: '/categories', icon: Tag, label: 'Categories' },
    { href: '/payment-methods', icon: CreditCard, label: 'Methods' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden z-50">
      <div className="grid grid-cols-4 py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center py-2 px-1 text-xs ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className="truncate">{label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}