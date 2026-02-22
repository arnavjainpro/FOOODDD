'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { UtensilsCrossed, PlusCircle, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/recipes', label: 'Recipes' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-warm-200/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <UtensilsCrossed className="h-5 w-5 text-terracotta-500 transition-transform group-hover:rotate-12" />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">
              FOOODDD
            </span>
            <span className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
              arnav + ayushi
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors rounded-md',
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-warm-100',
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 bg-terracotta-500 rounded-full"
                  />
                )}
              </span>
            </Link>
          ))}
          <Link href="/add">
            <Button size="sm" className="ml-2 gap-1.5 bg-terracotta-500 hover:bg-terracotta-600 text-white">
              <PlusCircle className="h-4 w-4" />
              Add Recipe
            </Button>
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="md:hidden border-t border-warm-200/60 bg-background px-4 py-3 space-y-1"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-warm-100 text-foreground'
                  : 'text-muted-foreground hover:bg-warm-50 hover:text-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/add" onClick={() => setMobileOpen(false)}>
            <Button size="sm" className="w-full mt-2 gap-1.5 bg-terracotta-500 hover:bg-terracotta-600 text-white">
              <PlusCircle className="h-4 w-4" />
              Add Recipe
            </Button>
          </Link>
        </motion.div>
      )}
    </header>
  )
}
