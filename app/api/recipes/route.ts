import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { createRecipe } from '@/lib/data'
import { slugify } from '@/lib/slugify'
import { Recipe } from '@/types/recipe'

export async function GET() {
  const { getAllRecipes } = await import('@/lib/data')
  const recipes = await getAllRecipes()
  return NextResponse.json(recipes)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: 'title is required' }, { status: 400 })
    }

    const now = new Date().toISOString()

    const recipe: Recipe = {
      id: uuidv4(),
      slug: slugify(body.title),
      title: body.title,
      description: body.description ?? '',
      coverImage: body.coverImage ?? '',
      cuisine: body.cuisine ?? 'Other',
      dietTags: Array.isArray(body.dietTags) ? body.dietTags : [],
      difficulty: body.difficulty ?? 'medium',
      spiceLevel: body.spiceLevel ?? 'mild',
      prepTimeMin: Number(body.prepTimeMin) || 0,
      cookTimeMin: Number(body.cookTimeMin) || 0,
      totalTimeMin: Number(body.totalTimeMin) || (Number(body.prepTimeMin) + Number(body.cookTimeMin)) || 0,
      servings: Number(body.servings) || 2,
      ingredients: Array.isArray(body.ingredients) ? body.ingredients : [],
      steps: Array.isArray(body.steps) ? body.steps : [],
      notes: body.notes ?? {},
      createdAt: now,
      updatedAt: now,
      cookedLog: [],
      rating: body.rating,
      makeAgain: body.makeAgain,
    }

    const saved = await createRecipe(recipe)
    return NextResponse.json(saved, { status: 201 })
  } catch (err) {
    console.error('[POST /api/recipes]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
