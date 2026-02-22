import { Recipe } from '@/types/recipe'
import RecipeCard from './RecipeCard'
import { Skeleton } from './ui/skeleton'

interface RecipeGridProps {
  recipes: Recipe[]
  loading?: boolean
}

function RecipeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-warm-200/60 overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function RecipeGrid({ recipes, loading = false }: RecipeGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">🍽️</div>
        <h3 className="font-serif text-xl font-semibold text-foreground">No recipes found</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
          Try adjusting your search or filters, or add a new recipe.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {recipes.map((recipe, i) => (
        <RecipeCard key={recipe.id} recipe={recipe} index={i} />
      ))}
    </div>
  )
}
