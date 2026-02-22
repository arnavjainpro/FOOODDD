'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, Flame, ChefHat, Users } from 'lucide-react'
import { Recipe } from '@/types/recipe'
import TagChips from './TagChips'
import { cn } from '@/lib/utils'

interface RecipeCardProps {
  recipe: Recipe
  index?: number
}

const difficultyConfig = {
  easy: { label: 'Easy', className: 'text-emerald-600' },
  medium: { label: 'Medium', className: 'text-amber-600' },
  hard: { label: 'Hard', className: 'text-rose-600' },
}

const spiceConfig = {
  mild: { dots: 1 },
  medium: { dots: 2 },
  hot: { dots: 3 },
}

export default function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  const diff = difficultyConfig[recipe.difficulty]
  const spice = spiceConfig[recipe.spiceLevel]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/recipes/${recipe.slug}`} className="block h-full">
        <article className="h-full flex flex-col overflow-hidden rounded-2xl border border-warm-200/60 bg-card shadow-sm transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-warm-900/8">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-warm-100">
            <Image
              src={recipe.coverImage}
              alt={recipe.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Cuisine pill */}
            <div className="absolute top-3 left-3">
              <span className="rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {recipe.cuisine}
              </span>
            </div>
            {/* Spice dots */}
            <div className="absolute top-3 right-3 flex gap-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <Flame
                  key={i}
                  className={cn(
                    'h-3.5 w-3.5',
                    i < spice.dots ? 'text-terracotta-400' : 'text-white/30',
                  )}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div>
              <h3 className="font-serif text-lg font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-terracotta-600 transition-colors">
                {recipe.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {recipe.totalTimeMin}m
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {recipe.servings}
              </span>
              <span className={cn('flex items-center gap-1 font-medium ml-auto', diff.className)}>
                <ChefHat className="h-3.5 w-3.5" />
                {diff.label}
              </span>
            </div>

            {/* Tags */}
            {recipe.dietTags.length > 0 && (
              <TagChips tags={recipe.dietTags.slice(0, 3)} variant="diet" />
            )}
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
