import { Ingredient } from '@/types/recipe'

/** Scale ingredient quantities proportionally to a new serving count. */
export function scaleIngredients(
  ingredients: Ingredient[],
  originalServings: number,
  newServings: number,
): Ingredient[] {
  if (originalServings === 0) return ingredients
  const ratio = newServings / originalServings
  return ingredients.map((ing) => ({
    ...ing,
    quantity: roundToReasonable(ing.quantity * ratio),
  }))
}

function roundToReasonable(n: number): number {
  if (n === 0) return 0
  if (n < 1)   return Math.round(n * 8) / 8   // 1/8 steps for small amounts
  if (n < 10)  return Math.round(n * 4) / 4   // 1/4 steps up to 10
  if (n < 100) return Math.round(n * 2) / 2   // 1/2 steps up to 100
  return Math.round(n)                        // whole numbers for large amounts
}
