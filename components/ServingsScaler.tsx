'use client'

import { Minus, Plus, Users } from 'lucide-react'

interface ServingsScalerProps {
  servings: number
  onServingsChange: (n: number) => void
}

export default function ServingsScaler({ servings, onServingsChange }: ServingsScalerProps) {
  const decrement = () => onServingsChange(Math.max(1, servings - 1))
  const increment = () => onServingsChange(Math.min(50, servings + 1))

  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        <Users className="h-4 w-4 text-terracotta-500" />
        Servings
      </span>
      <div className="flex items-center rounded-full border border-warm-200 bg-warm-50 overflow-hidden">
        <button
          onClick={decrement}
          disabled={servings <= 1}
          className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-warm-100 hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Decrease servings"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="min-w-[2.5rem] text-center text-sm font-semibold text-foreground tabular-nums">
          {servings}
        </span>
        <button
          onClick={increment}
          disabled={servings >= 50}
          className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-warm-100 hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Increase servings"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
