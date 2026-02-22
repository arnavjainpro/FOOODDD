import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Playfair_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { cn } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'FOOODDD — Arnav + Ayushi',
    template: '%s | FOOODDD',
  },
  description:
    'Our personal recipe journal — the dishes we cook, the tweaks we make, and the meals we keep coming back to.',
  openGraph: {
    type: 'website',
    title: 'FOOODDD — Arnav + Ayushi',
    description: 'Our personal recipe journal.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(inter.variable, playfair.variable)} suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  )
}
