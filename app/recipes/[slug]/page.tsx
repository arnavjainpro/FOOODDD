import { notFound } from 'next/navigation'
import { getAllRecipes, getRecipeBySlug } from '@/lib/data'
import type { Metadata } from 'next'
import RecipeDetailClient from './RecipeDetailClient'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const recipes = await getAllRecipes()
  return recipes.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const recipe = await getRecipeBySlug(params.slug)
  if (!recipe) return { title: 'Recipe not found' }
  return {
    title: recipe.title,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: [{ url: recipe.coverImage }],
    },
  }
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const recipe = await getRecipeBySlug(params.slug)
  if (!recipe) notFound()

  return <RecipeDetailClient recipe={recipe} />
}
