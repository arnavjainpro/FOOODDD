import { cn } from '@/lib/utils'

interface TagChipsProps {
  tags: string[]
  className?: string
  variant?: 'diet' | 'cuisine' | 'default'
}

const dietColors: Record<string, string> = {
  vegan: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  vegetarian: 'bg-green-50 text-green-700 border-green-200',
  'gluten-free': 'bg-amber-50 text-amber-700 border-amber-200',
  'dairy-free': 'bg-sky-50 text-sky-700 border-sky-200',
  'nut-free': 'bg-orange-50 text-orange-700 border-orange-200',
}

export default function TagChips({ tags, className, variant = 'default' }: TagChipsProps) {
  if (!tags || tags.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {tags.map((tag) => {
        const colorClass =
          variant === 'diet'
            ? (dietColors[tag.toLowerCase()] ?? 'bg-warm-100 text-warm-700 border-warm-200')
            : 'bg-warm-100 text-warm-700 border-warm-200'

        return (
          <span
            key={tag}
            className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
              colorClass,
            )}
          >
            {tag}
          </span>
        )
      })}
    </div>
  )
}
