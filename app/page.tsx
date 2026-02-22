import Link from 'next/link'
import Image from 'next/image'
import { getAllRecipes, getRandomRecipe } from '@/lib/data'
import FeaturedCarousel from '@/components/FeaturedCarousel'
import RecipeCard from '@/components/RecipeCard'
import HomeSearchBar from './HomeSearchBar'
import TonightsPick from './TonightsPick'

const CATEGORIES = [
  { label: 'Indian', emoji: '🍛' },
  { label: 'Italian', emoji: '🍝' },
  { label: 'Drinks', emoji: '🥂' },
  { label: 'Desserts', emoji: '🍰' },
  { label: 'Vegan', emoji: '🌱' },
  { label: 'Quick', emoji: '⚡' },
]

export default async function HomePage() {
  const allRecipes = await getAllRecipes()
  const featured = allRecipes.slice(0, 6)

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80"
            alt="Kitchen background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/85 via-[#1C1917]/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 py-20">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-medium tracking-[0.2em] uppercase text-terracotta-300">
              Our kitchen stories
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] text-white">
              The Recipes
              <br />
              <span className="text-terracotta-300">We Live By</span>
            </h1>
            <p className="mt-5 text-lg text-white/70 leading-relaxed max-w-md">
              A collection of the dishes we keep coming back to — with notes, tweaks, and the honest truth about what actually works.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/recipes"
                className="inline-flex items-center rounded-full bg-terracotta-500 hover:bg-terracotta-600 px-6 py-3 text-sm font-semibold text-white transition-colors shadow-lg shadow-terracotta-900/30"
              >
                Browse recipes →
              </Link>
              <TonightsPick recipes={allRecipes} />
            </div>

            {/* Search */}
            <div className="mt-8 max-w-sm">
              <HomeSearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Category chips */}
      <section className="container mx-auto px-4 md:px-6 py-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">Browse by type</h2>
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={`/recipes?q=${cat.label.toLowerCase()}`}
              className="flex items-center gap-2 rounded-full border border-warm-200 bg-warm-50 hover:bg-warm-100 hover:border-warm-300 px-4 py-2 text-sm font-medium text-foreground transition-colors"
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured carousel */}
      <section className="container mx-auto px-4 md:px-6 pb-14">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-serif text-2xl font-semibold text-foreground">Featured recipes</h2>
          <Link
            href="/recipes"
            className="text-sm font-medium text-terracotta-600 hover:text-terracotta-700 transition-colors"
          >
            View all →
          </Link>
        </div>
        <FeaturedCarousel recipes={featured} />
      </section>

      {/* Recent recipes grid */}
      <section className="container mx-auto px-4 md:px-6 pb-20">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-serif text-2xl font-semibold text-foreground">Latest additions</h2>
          <Link
            href="/recipes"
            className="text-sm font-medium text-terracotta-600 hover:text-terracotta-700 transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allRecipes.slice(0, 3).map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={i} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-warm-200 bg-warm-50 py-8">
        <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>Made with love by Arnav + Ayushi ♥</p>
          <Link href="/add" className="text-terracotta-500 hover:text-terracotta-600 font-medium transition-colors">
            + Add a recipe
          </Link>
        </div>
      </footer>
    </>
  )
}
