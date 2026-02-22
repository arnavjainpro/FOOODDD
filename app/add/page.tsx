import type { Metadata } from 'next'
import AddRecipeForm from './AddRecipeForm'

export const metadata: Metadata = {
  title: 'Add Recipe',
  description: 'Add a new recipe to our collection.',
}

export default function AddRecipePage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 md:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Add a Recipe</h1>
        <p className="mt-2 text-muted-foreground">
          Document it before you forget the tweaks that made it perfect.
        </p>
      </div>
      <AddRecipeForm />
    </div>
  )
}
