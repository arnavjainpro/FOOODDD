import { Suspense } from 'react'
import { getAllRecipes } from '@/lib/data'
import RecipesClient from './RecipesClient'
import { Skeleton } from '@/components/ui/skeleton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recipes',
  description: 'All our recipes — searchable, filterable, sorted your way.',
}

function RecipesLoading() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <Skeleton className="h-10 w-48 mb-2" />
      <Skeleton className="h-5 w-32 mb-8" />
      <div className="flex gap-3 mb-8">
        <Skeleton className="h-10 flex-1 max-w-lg rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-warm-200/60 overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function RecipesPage() {
  const recipes = await getAllRecipes()
  const cuisines = Array.from(new Set(recipes.map((r) => r.cuisine))).sort()

  return (
    <Suspense fallback={<RecipesLoading />}>
      <RecipesClient initialRecipes={recipes} availableCuisines={cuisines} />
    </Suspense>
  )
}
