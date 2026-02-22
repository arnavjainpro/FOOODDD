/**
 * Data Access Layer — Phase 1
 * All reads/writes go through this file. To migrate to Prisma/SQLite,
 * replace these implementations while keeping the same function signatures.
 */
import fs from 'fs'
import path from 'path'
import { Recipe } from '@/types/recipe'

const DATA_PATH = path.join(process.cwd(), 'data', 'recipes.json')

function readAll(): Recipe[] {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8')
  return JSON.parse(raw) as Recipe[]
}

function writeAll(recipes: Recipe[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(recipes, null, 2), 'utf-8')
}

export async function getAllRecipes(): Promise<Recipe[]> {
  return readAll()
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const recipes = readAll()
  return recipes.find((r) => r.slug === slug) ?? null
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const recipes = readAll()
  return recipes.find((r) => r.id === id) ?? null
}

export async function createRecipe(recipe: Recipe): Promise<Recipe> {
  const recipes = readAll()
  // Ensure slug uniqueness
  let slug = recipe.slug
  let counter = 1
  while (recipes.some((r) => r.slug === slug)) {
    slug = `${recipe.slug}-${counter++}`
  }
  const final = { ...recipe, slug }
  recipes.unshift(final) // newest first
  writeAll(recipes)
  return final
}

export async function updateRecipe(id: string, data: Partial<Recipe>): Promise<Recipe | null> {
  const recipes = readAll()
  const idx = recipes.findIndex((r) => r.id === id)
  if (idx === -1) return null
  recipes[idx] = { ...recipes[idx], ...data, updatedAt: new Date().toISOString() }
  writeAll(recipes)
  return recipes[idx]
}

export async function deleteRecipe(id: string): Promise<boolean> {
  const recipes = readAll()
  const filtered = recipes.filter((r) => r.id !== id)
  if (filtered.length === recipes.length) return false
  writeAll(filtered)
  return true
}

export async function getFeaturedRecipes(limit = 6): Promise<Recipe[]> {
  const recipes = readAll()
  return recipes.slice(0, limit)
}

export async function getRandomRecipe(): Promise<Recipe | null> {
  const recipes = readAll()
  if (recipes.length === 0) return null
  return recipes[Math.floor(Math.random() * recipes.length)]
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  const q = query.toLowerCase()
  const recipes = readAll()
  return recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.dietTags.some((t) => t.toLowerCase().includes(q)),
  )
}
