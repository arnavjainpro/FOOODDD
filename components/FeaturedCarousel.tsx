'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react'
import { Recipe } from '@/types/recipe'
import { cn } from '@/lib/utils'

interface FeaturedCarouselProps {
  recipes: Recipe[]
}

export default function FeaturedCarousel({ recipes }: FeaturedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, recipes.length - 1))
    setActiveIndex(clamped)
    const container = containerRef.current
    if (container) {
      const card = container.children[clamped] as HTMLElement
      card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }

  return (
    <div className="relative">
      {/* Scroll container */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={(e) => {
          const el = e.currentTarget
          const cardWidth = el.scrollWidth / recipes.length
          const newIndex = Math.round(el.scrollLeft / cardWidth)
          setActiveIndex(newIndex)
        }}
      >
        {recipes.map((recipe, i) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-none w-[280px] sm:w-[320px] snap-start"
          >
            <Link href={`/recipes/${recipe.slug}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-warm-100">
                <Image
                  src={recipe.coverImage}
                  alt={recipe.title}
                  fill
                  sizes="320px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="text-xs font-medium tracking-wide uppercase text-white/70 mb-1">
                    {recipe.cuisine}
                  </p>
                  <h3 className="font-serif text-lg font-bold leading-snug line-clamp-2">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-white/80">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {recipe.totalTimeMin}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {recipe.servings} servings
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Nav arrows */}
      <button
        onClick={() => scrollTo(activeIndex - 1)}
        disabled={activeIndex === 0}
        className={cn(
          'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 rounded-full bg-white border border-warm-200 shadow-md p-2 transition-all',
          activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-warm-50 hover:shadow-lg',
        )}
        aria-label="Previous"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => scrollTo(activeIndex + 1)}
        disabled={activeIndex === recipes.length - 1}
        className={cn(
          'absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 rounded-full bg-white border border-warm-200 shadow-md p-2 transition-all',
          activeIndex === recipes.length - 1
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:bg-warm-50 hover:shadow-lg',
        )}
        aria-label="Next"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {recipes.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
              'rounded-full transition-all duration-200',
              i === activeIndex
                ? 'w-5 h-1.5 bg-terracotta-500'
                : 'w-1.5 h-1.5 bg-warm-300 hover:bg-warm-400',
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
