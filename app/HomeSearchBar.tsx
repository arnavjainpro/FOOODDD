'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'

export default function HomeSearchBar() {
  const router = useRouter()
  const [q, setQ] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) router.push(`/recipes?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <form onSubmit={submit} className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name, cuisine, ingredient…"
        className="w-full rounded-full border border-white/20 bg-white/10 backdrop-blur py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/40 focus:bg-white/15 transition-all"
      />
    </form>
  )
}
