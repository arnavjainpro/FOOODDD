'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, Loader2, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import ImageUpload from '@/components/ImageUpload'

const ingredientSchema = z.object({
  item: z.string().min(1, 'Required'),
  quantity: z.coerce.number().positive('Must be positive'),
  unit: z.string().min(1, 'Required'),
  notes: z.string().optional(),
})

const stepSchema = z.object({
  text: z.string().min(1, 'Required'),
  timerSec: z.coerce.number().optional(),
})

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(10, 'Add a short description'),
  coverImage: z.string().min(1, 'A cover image is required').refine(
    (v) => v.startsWith('/uploads/') || v.startsWith('http'),
    'Must be an uploaded image or a valid URL',
  ),
  cuisine: z.string().min(1, 'Select a cuisine'),
  dietTags: z.string(), // comma-separated
  difficulty: z.enum(['easy', 'medium', 'hard']),
  spiceLevel: z.enum(['mild', 'medium', 'hot']),
  prepTimeMin: z.coerce.number().int().positive(),
  cookTimeMin: z.coerce.number().int().min(0),
  servings: z.coerce.number().int().positive(),
  ingredients: z.array(ingredientSchema).min(1, 'Add at least one ingredient'),
  steps: z.array(stepSchema).min(1, 'Add at least one step'),
  notesArnav: z.string().optional(),
  notesAyushi: z.string().optional(),
  makeAgain: z.boolean().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
})

type FormValues = z.infer<typeof schema>

const CUISINES = ['Indian', 'Italian', 'French', 'Cuban', 'American', 'Japanese', 'Mexican', 'Thai', 'Chinese', 'Other']

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-destructive">{message}</p>
}

export default function AddRecipeForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      difficulty: 'medium',
      spiceLevel: 'mild',
      ingredients: [{ item: '', quantity: 1, unit: '', notes: '' }],
      steps: [{ text: '' }],
    },
  })

  const { fields: ingFields, append: appendIng, remove: removeIng } = useFieldArray({
    control,
    name: 'ingredients',
  })
  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: 'steps',
  })

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true)
    try {
      const payload = {
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        cuisine: data.cuisine,
        dietTags: data.dietTags.split(',').map((t) => t.trim()).filter(Boolean),
        difficulty: data.difficulty,
        spiceLevel: data.spiceLevel,
        prepTimeMin: data.prepTimeMin,
        cookTimeMin: data.cookTimeMin,
        totalTimeMin: data.prepTimeMin + data.cookTimeMin,
        servings: data.servings,
        ingredients: data.ingredients,
        steps: data.steps.map((s) => ({
          text: s.text,
          ...(s.timerSec ? { timerSec: s.timerSec } : {}),
        })),
        notes: {
          ...(data.notesArnav ? { arnav: data.notesArnav } : {}),
          ...(data.notesAyushi ? { ayushi: data.notesAyushi } : {}),
        },
        makeAgain: data.makeAgain,
        rating: data.rating,
      }

      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to save recipe')
      const saved = await res.json()
      setSuccess(true)
      setTimeout(() => router.push(`/recipes/${saved.slug}`), 1200)
    } catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  const fieldClass = 'bg-warm-50 border-warm-200 focus-visible:ring-terracotta-300 focus-visible:border-terracotta-400'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basics */}
      <Section title="The basics">
        <Field label="Recipe title" error={errors.title?.message}>
          <Input {...register('title')} placeholder="e.g. Butter Chicken" className={fieldClass} />
        </Field>
        <Field label="Description" error={errors.description?.message}>
          <Textarea
            {...register('description')}
            placeholder="A brief description of what this dish is and why you love it…"
            rows={3}
            className={fieldClass}
          />
        </Field>
        <Field label="Cover image" error={errors.coverImage?.message}>
          <ImageUpload
            value={watch('coverImage') ?? ''}
            onChange={(url) => setValue('coverImage', url, { shouldValidate: true })}
            error={errors.coverImage?.message}
          />
        </Field>
      </Section>

      {/* Classification */}
      <Section title="Classification">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Cuisine" error={errors.cuisine?.message}>
            <Select onValueChange={(v) => setValue('cuisine', v)}>
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="Select cuisine" />
              </SelectTrigger>
              <SelectContent>
                {CUISINES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Diet tags" error={errors.dietTags?.message}>
            <Input
              {...register('dietTags')}
              placeholder="vegan, gluten-free, …"
              className={fieldClass}
            />
            <p className="mt-1 text-xs text-muted-foreground">Comma-separated</p>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Difficulty" error={errors.difficulty?.message}>
            <Select defaultValue="medium" onValueChange={(v) => setValue('difficulty', v as 'easy' | 'medium' | 'hard')}>
              <SelectTrigger className={fieldClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Spice level" error={errors.spiceLevel?.message}>
            <Select defaultValue="mild" onValueChange={(v) => setValue('spiceLevel', v as 'mild' | 'medium' | 'hot')}>
              <SelectTrigger className={fieldClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild 🌶</SelectItem>
                <SelectItem value="medium">Medium 🌶🌶</SelectItem>
                <SelectItem value="hot">Hot 🌶🌶🌶</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Section>

      {/* Timing + servings */}
      <Section title="Time and servings">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Prep time (min)" error={errors.prepTimeMin?.message}>
            <Input type="number" {...register('prepTimeMin')} placeholder="15" className={fieldClass} />
          </Field>
          <Field label="Cook time (min)" error={errors.cookTimeMin?.message}>
            <Input type="number" {...register('cookTimeMin')} placeholder="30" className={fieldClass} />
          </Field>
          <Field label="Servings" error={errors.servings?.message}>
            <Input type="number" {...register('servings')} placeholder="4" className={fieldClass} />
          </Field>
        </div>
      </Section>

      {/* Ingredients */}
      <Section title="Ingredients">
        <div className="space-y-2.5">
          {ingFields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-start">
              <div className="grid grid-cols-[1fr_80px_90px] gap-2 flex-1 min-w-0">
                <Input {...register(`ingredients.${i}.item`)} placeholder="Ingredient" className={cn(fieldClass, 'text-sm')} />
                <Input {...register(`ingredients.${i}.quantity`)} type="number" placeholder="Qty" step="0.25" className={cn(fieldClass, 'text-sm')} />
                <Input {...register(`ingredients.${i}.unit`)} placeholder="Unit" className={cn(fieldClass, 'text-sm')} />
              </div>
              <button
                type="button"
                onClick={() => removeIng(i)}
                disabled={ingFields.length === 1}
                className="mt-2 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {errors.ingredients?.root && (
            <p className="text-xs text-destructive">{errors.ingredients.root.message}</p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendIng({ item: '', quantity: 1, unit: '', notes: '' })}
          className="mt-2 gap-1.5 border-warm-200 text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Add ingredient
        </Button>
      </Section>

      {/* Steps */}
      <Section title="Method / Steps">
        <div className="space-y-3">
          {stepFields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-start">
              <span className="flex-none mt-3 flex h-6 w-6 items-center justify-center rounded-full bg-warm-200 text-xs font-semibold text-warm-700">
                {i + 1}
              </span>
              <div className="flex-1 space-y-1.5">
                <Textarea
                  {...register(`steps.${i}.text`)}
                  placeholder={`Step ${i + 1}…`}
                  rows={2}
                  className={cn(fieldClass, 'text-sm')}
                />
                <Input
                  {...register(`steps.${i}.timerSec`)}
                  type="number"
                  placeholder="Timer (seconds, optional)"
                  className={cn(fieldClass, 'text-sm h-8')}
                />
              </div>
              <button
                type="button"
                onClick={() => removeStep(i)}
                disabled={stepFields.length === 1}
                className="mt-2 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendStep({ text: '' })}
          className="mt-2 gap-1.5 border-warm-200 text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Add step
        </Button>
      </Section>

      {/* Personal notes */}
      <Section title="Personal notes (optional)">
        <Field label="Arnav's note">
          <Textarea
            {...register('notesArnav')}
            placeholder="A tip, a tweak, something that makes this dish yours…"
            rows={2}
            className={fieldClass}
          />
        </Field>
        <Field label="Ayushi's note">
          <Textarea
            {...register('notesAyushi')}
            placeholder="Your take on it…"
            rows={2}
            className={fieldClass}
          />
        </Field>
      </Section>

      {/* Submit */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={submitting || success}
          className="w-full sm:w-auto gap-2 bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-md shadow-terracotta-200 disabled:opacity-80"
        >
          {success ? (
            <>
              <Check className="h-4 w-4" />
              Saved! Redirecting…
            </>
          ) : submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            'Save Recipe'
          )}
        </Button>
      </div>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-serif text-lg font-semibold text-foreground border-b border-warm-100 pb-2">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      <FieldError message={error} />
    </div>
  )
}
