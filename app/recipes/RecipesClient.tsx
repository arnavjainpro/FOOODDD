'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Recipe } from '@/types/recipe'
import RecipeGrid from '@/components/RecipeGrid'
import SearchBar from '@/components/SearchBar'
import FilterDrawer, { FilterState } from '@/components/FilterDrawer'

interface RecipesClientProps {
  initialRecipes: Recipe[]
  availableCuisines: string[]
}

const DEFAULT_FILTERS: FilterState = {
  cuisines: [],
  dietTags: [],
  difficulties: [],
  spiceLevels: [],
  sortBy: 'newest',
}

function sortRecipes(recipes: Recipe[], sortBy: string): Recipe[] {
  const sorted = [...recipes]
  switch (sortBy) {
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case 'quickest':
      return sorted.sort((a, b) => a.totalTimeMin - b.totalTimeMin)
    case 'az':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default: // newest
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
}

export default function RecipesClient({ initialRecipes, availableCuisines }: RecipesClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  // Sync query param → search box on mount / URL change
  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  // Update URL when query changes (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) params.set('q', query)
      else params.delete('q')
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, 300)
    return () => clearTimeout(t)
  }, [query, pathname, router, searchParams])

  const filteredRecipes = useMemo(() => {
    let result = initialRecipes

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.dietTags.some((t) => t.toLowerCase().includes(q)) ||
          r.ingredients.some((i) => i.item.toLowerCase().includes(q)),
      )
    }

    // Cuisine filter
    if (filters.cuisines.length > 0) {
      result = result.filter((r) => filters.cuisines.includes(r.cuisine))
    }

    // Diet tags filter
    if (filters.dietTags.length > 0) {
      result = result.filter((r) => filters.dietTags.every((t) => r.dietTags.includes(t)))
    }

    // Difficulty filter
    if (filters.difficulties.length > 0) {
      result = result.filter((r) => filters.difficulties.includes(r.difficulty))
    }

    // Spice level filter
    if (filters.spiceLevels.length > 0) {
      result = result.filter((r) => filters.spiceLevels.includes(r.spiceLevel))
    }

    return sortRecipes(result, filters.sortBy)
  }, [initialRecipes, query, filters])

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">All Recipes</h1>
        <p className="mt-2 text-muted-foreground">
          {initialRecipes.length} recipes and counting.
        </p>
      </div>

      {/* Search + filter row */}
      <div className="flex gap-3 mb-8">
        <SearchBar
          value={query}
          onChange={setQuery}
          className="flex-1 max-w-lg"
          placeholder="Search recipes, ingredients, cuisines…"
        />
        <FilterDrawer
          filters={filters}
          onChange={setFilters}
          availableCuisines={availableCuisines}
        />
      </div>

      {/* Results count */}
      {query || Object.values(filters).some((v) => (Array.isArray(v) ? v.length > 0 : v !== 'newest')) ? (
        <p className="text-sm text-muted-foreground mb-5">
          Showing {filteredRecipes.length} of {initialRecipes.length} recipes
        </p>
      ) : null}

      {/* Grid */}
      <RecipeGrid recipes={filteredRecipes} />
    </div>
  )
}
