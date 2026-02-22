'use client'

import { SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export interface FilterState {
  cuisines: string[]
  dietTags: string[]
  difficulties: string[]
  spiceLevels: string[]
  sortBy: string
}

const ALL_CUISINES = ['Indian', 'Italian', 'French', 'Cuban', 'American', 'Japanese', 'Mexican', 'Thai']
const ALL_DIET_TAGS = ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free']
const DIFFICULTIES = ['easy', 'medium', 'hard']
const SPICE_LEVELS = ['mild', 'medium', 'hot']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'quickest', label: 'Quickest to make' },
  { value: 'az', label: 'A → Z' },
]

interface FilterDrawerProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  availableCuisines?: string[]
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</h3>
      {children}
    </div>
  )
}

function CheckboxItem({
  id,
  label,
  checked,
  onToggle,
}: {
  id: string
  label: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onToggle}
        className="border-warm-300 data-[state=checked]:bg-terracotta-500 data-[state=checked]:border-terracotta-500"
      />
      <Label htmlFor={id} className="text-sm font-normal capitalize cursor-pointer">
        {label}
      </Label>
    </div>
  )
}

export default function FilterDrawer({ filters, onChange, availableCuisines }: FilterDrawerProps) {
  const cuisines = availableCuisines ?? ALL_CUISINES
  const activeCount =
    filters.cuisines.length +
    filters.dietTags.length +
    filters.difficulties.length +
    filters.spiceLevels.length

  function toggle<T extends keyof FilterState>(key: T, value: string) {
    const current = filters[key] as string[]
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    onChange({ ...filters, [key]: next })
  }

  function reset() {
    onChange({ cuisines: [], dietTags: [], difficulties: [], spiceLevels: [], sortBy: 'newest' })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-full border-warm-200">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta-500 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-serif text-lg">Filter Recipes</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Sort */}
          <FilterSection title="Sort by">
            <div className="grid grid-cols-2 gap-1.5">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onChange({ ...filters, sortBy: opt.value })}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-xs font-medium text-left transition-colors',
                    filters.sortBy === opt.value
                      ? 'border-terracotta-400 bg-terracotta-50 text-terracotta-700'
                      : 'border-warm-200 bg-warm-50 text-muted-foreground hover:border-warm-300',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FilterSection>

          <Separator className="bg-warm-100" />

          {/* Cuisine */}
          <FilterSection title="Cuisine">
            <div className="space-y-2">
              {cuisines.map((c) => (
                <CheckboxItem
                  key={c}
                  id={`cuisine-${c}`}
                  label={c}
                  checked={filters.cuisines.includes(c)}
                  onToggle={() => toggle('cuisines', c)}
                />
              ))}
            </div>
          </FilterSection>

          <Separator className="bg-warm-100" />

          {/* Diet */}
          <FilterSection title="Dietary">
            <div className="space-y-2">
              {ALL_DIET_TAGS.map((t) => (
                <CheckboxItem
                  key={t}
                  id={`diet-${t}`}
                  label={t}
                  checked={filters.dietTags.includes(t)}
                  onToggle={() => toggle('dietTags', t)}
                />
              ))}
            </div>
          </FilterSection>

          <Separator className="bg-warm-100" />

          {/* Difficulty */}
          <FilterSection title="Difficulty">
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => toggle('difficulties', d)}
                  className={cn(
                    'flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium capitalize transition-colors',
                    filters.difficulties.includes(d)
                      ? 'border-terracotta-400 bg-terracotta-50 text-terracotta-700'
                      : 'border-warm-200 bg-warm-50 text-muted-foreground hover:border-warm-300',
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </FilterSection>

          <Separator className="bg-warm-100" />

          {/* Spice */}
          <FilterSection title="Spice Level">
            <div className="flex gap-2">
              {SPICE_LEVELS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle('spiceLevels', s)}
                  className={cn(
                    'flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium capitalize transition-colors',
                    filters.spiceLevels.includes(s)
                      ? 'border-terracotta-400 bg-terracotta-50 text-terracotta-700'
                      : 'border-warm-200 bg-warm-50 text-muted-foreground hover:border-warm-300',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Reset */}
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="w-full gap-1.5 text-muted-foreground hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" />
              Clear all filters
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
