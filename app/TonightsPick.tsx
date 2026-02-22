'use client'

import { useRouter } from 'next/navigation'
import { Shuffle } from 'lucide-react'
import { Recipe } from '@/types/recipe'

interface TonightsPickProps {
  recipes: Recipe[]
}

export default function TonightsPick({ recipes }: TonightsPickProps) {
  const router = useRouter()

  const pick = () => {
    if (!recipes.length) return
    const random = recipes[Math.floor(Math.random() * recipes.length)]
    router.push(`/recipes/${random.slug}`)
  }

  return (
    <button
      onClick={pick}
      className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur px-6 py-3 text-sm font-semibold text-white transition-all"
    >
      <Shuffle className="h-4 w-4" />
      Tonight's pick
    </button>
  )
}
