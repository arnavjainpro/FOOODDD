export type Difficulty = 'easy' | 'medium' | 'hard'
export type SpiceLevel = 'mild' | 'medium' | 'hot'

export interface Ingredient {
  item: string
  quantity: number
  unit: string
  notes?: string
}

export interface Step {
  text: string
  timerSec?: number
}

export interface RecipeNotes {
  arnav?: string
  ayushi?: string
}

export interface CookedLogEntry {
  dateISO: string
  photoUrl?: string
  quickNote?: string
}

export interface Recipe {
  id: string
  slug: string
  title: string
  description: string
  coverImage: string
  cuisine: string
  dietTags: string[]
  difficulty: Difficulty
  spiceLevel: SpiceLevel
  prepTimeMin: number
  cookTimeMin: number
  totalTimeMin: number
  servings: number
  ingredients: Ingredient[]
  steps: Step[]
  notes: RecipeNotes
  createdAt: string
  updatedAt: string
  cookedLog: CookedLogEntry[]
  rating?: number
  makeAgain?: boolean
}

export type RecipeFormData = Omit<Recipe, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'cookedLog'>
