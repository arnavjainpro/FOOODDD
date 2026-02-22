'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Clock,
  Users,
  ChefHat,
  Flame,
  ArrowLeft,
  Maximize2,
  StickyNote,
} from 'lucide-react'
import { Recipe } from '@/types/recipe'
import { scaleIngredients } from '@/lib/scaling'
import { convertUnit, formatQuantity, UnitSystem } from '@/lib/units'
import ServingsScaler from '@/components/ServingsScaler'
import StepTimerList from '@/components/StepTimerList'
import CookingModeDialog from '@/components/CookingModeDialog'
import TagChips from '@/components/TagChips'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const difficultyLabel = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
const spiceLabel = { mild: 'Mild 🌶', medium: 'Medium 🌶🌶', hot: 'Hot 🌶🌶🌶' }

export default function RecipeDetailClient({ recipe }: { recipe: Recipe }) {
  const [servings, setServings] = useState(recipe.servings)
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set())
  const [cookingMode, setCookingMode] = useState(false)

  const scaledIngredients = scaleIngredients(recipe.ingredients, recipe.servings, servings)

  const displayIngredients = scaledIngredients.map((ing) => {
    if (unitSystem === 'us') {
      const converted = convertUnit(ing.quantity, ing.unit, 'us')
      return { ...ing, quantity: converted.quantity, unit: converted.unit }
    }
    return ing
  })

  const toggleStep = (i: number) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <>
      <CookingModeDialog
        steps={recipe.steps}
        title={recipe.title}
        open={cookingMode}
        onClose={() => setCookingMode(false)}
      />

      <article>
        {/* Hero image */}
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[480px] overflow-hidden bg-warm-100">
          <Image
            src={recipe.coverImage}
            alt={recipe.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Back button */}
          <div className="absolute top-4 left-4">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-1.5 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur border border-white/20 px-3 py-1.5 text-xs font-medium text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <p className="text-xs font-medium tracking-widest uppercase text-white/60 mb-1">
              {recipe.cuisine}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 md:px-6 py-8">
          {/* Meta bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-3 pb-6 border-b border-warm-200"
          >
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-terracotta-400" />
              <span><strong className="text-foreground">{recipe.prepTimeMin}m</strong> prep</span>
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-terracotta-400" />
              <span><strong className="text-foreground">{recipe.cookTimeMin}m</strong> cook</span>
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-terracotta-400" />
              <strong className="text-foreground">{recipe.servings}</strong> servings
            </span>
            <span className="flex items-center gap-1.5 text-sm">
              <ChefHat className="h-4 w-4 text-terracotta-400" />
              <strong>{difficultyLabel[recipe.difficulty]}</strong>
            </span>
            <span className="text-sm">{spiceLabel[recipe.spiceLevel]}</span>
            <TagChips tags={recipe.dietTags} variant="diet" className="ml-auto" />
          </motion.div>

          {/* Description */}
          <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-2xl">
            {recipe.description}
          </p>

          {/* Cooking mode button */}
          <div className="mt-6 mb-8">
            <Button
              onClick={() => setCookingMode(true)}
              className="gap-2 bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-md shadow-terracotta-200"
            >
              <Maximize2 className="h-4 w-4" />
              Start cooking mode
            </Button>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 xl:gap-12">
            {/* Left: Ingredients */}
            <aside>
              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 sticky top-20 bg-background pt-1 pb-3 border-b border-warm-100 z-10">
                <ServingsScaler servings={servings} onServingsChange={setServings} />
                <div className="flex items-center gap-2">
                  <Label htmlFor="unit-toggle" className="text-xs font-medium text-muted-foreground cursor-pointer">
                    {unitSystem === 'metric' ? 'Metric' : 'US'}
                  </Label>
                  <Switch
                    id="unit-toggle"
                    checked={unitSystem === 'us'}
                    onCheckedChange={(v) => setUnitSystem(v ? 'us' : 'metric')}
                    className="data-[state=checked]:bg-terracotta-500"
                  />
                </div>
              </div>

              <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Ingredients</h2>
              <ul className="space-y-2.5">
                {displayIngredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="flex-none mt-0.5 h-1.5 w-1.5 rounded-full bg-terracotta-400 mt-2" />
                    <span>
                      <span className="font-semibold text-foreground tabular-nums">
                        {formatQuantity(ing.quantity)} {ing.unit}
                      </span>{' '}
                      <span className="text-foreground">{ing.item}</span>
                      {ing.notes && (
                        <span className="text-muted-foreground italic"> — {ing.notes}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Right: Steps */}
            <div>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-5">Method</h2>
              <StepTimerList
                steps={recipe.steps}
                checkedSteps={checkedSteps}
                onToggleStep={toggleStep}
              />
            </div>
          </div>

          {/* Notes section */}
          {(recipe.notes.arnav || recipe.notes.ayushi) && (
            <section className="mt-12 border-t border-warm-200 pt-8">
              <div className="flex items-center gap-2 mb-5">
                <StickyNote className="h-4 w-4 text-terracotta-500" />
                <h2 className="font-serif text-xl font-semibold text-foreground">Our Notes</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recipe.notes.arnav && (
                  <div className="rounded-xl border border-warm-200 bg-warm-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-500 mb-2">
                      Arnav's note
                    </p>
                    <p className="text-sm text-foreground leading-relaxed italic">
                      "{recipe.notes.arnav}"
                    </p>
                  </div>
                )}
                {recipe.notes.ayushi && (
                  <div className="rounded-xl border border-warm-200 bg-warm-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-500 mb-2">
                      Ayushi's note
                    </p>
                    <p className="text-sm text-foreground leading-relaxed italic">
                      "{recipe.notes.ayushi}"
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Cooked log */}
          {recipe.cookedLog.length > 0 && (
            <section className="mt-8 border-t border-warm-200 pt-8">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Cooking History</h2>
              <div className="space-y-2.5">
                {recipe.cookedLog.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="flex-none text-muted-foreground">
                      {new Date(entry.dateISO).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {entry.quickNote && (
                      <span className="text-foreground">— {entry.quickNote}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  )
}
