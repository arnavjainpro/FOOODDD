import { describe, it, expect } from '@jest/globals'
import { slugify } from '../lib/slugify'
import { scaleIngredients } from '../lib/scaling'
import { convertUnit, formatQuantity } from '../lib/units'
import type { Ingredient } from '../types/recipe'

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Butter Chicken')).toBe('butter-chicken')
  })
  it('removes special characters', () => {
    expect(slugify('Dal Makhani (vegan!)')).toBe('dal-makhani-vegan')
  })
  it('trims leading and trailing hyphens', () => {
    expect(slugify('  hello world  ')).toBe('hello-world')
  })
  it('collapses multiple spaces', () => {
    expect(slugify('cacio   e   pepe')).toBe('cacio-e-pepe')
  })
})

describe('scaleIngredients', () => {
  const base: Ingredient[] = [
    { item: 'flour', quantity: 200, unit: 'g' },
    { item: 'eggs', quantity: 2, unit: 'whole' },
  ]

  it('doubles quantities when servings are doubled', () => {
    const scaled = scaleIngredients(base, 2, 4)
    expect(scaled[0].quantity).toBe(400)
    expect(scaled[1].quantity).toBe(4)
  })

  it('halves quantities when servings are halved', () => {
    const scaled = scaleIngredients(base, 4, 2)
    expect(scaled[0].quantity).toBe(100)
    expect(scaled[1].quantity).toBe(1)
  })

  it('returns original if originalServings is same', () => {
    const scaled = scaleIngredients(base, 2, 2)
    expect(scaled[0].quantity).toBe(200)
  })

  it('handles zero original servings gracefully', () => {
    const scaled = scaleIngredients(base, 0, 4)
    expect(scaled).toEqual(base)
  })
})

describe('convertUnit', () => {
  it('converts ml to cups', () => {
    const r = convertUnit(240, 'ml', 'us')
    expect(r.unit).toBe('cups')
    expect(r.quantity).toBe(1)
  })
  it('converts g to oz', () => {
    const r = convertUnit(28.35, 'g', 'us')
    expect(r.unit).toBe('oz')
    expect(r.quantity).toBeCloseTo(1, 0)
  })
  it('passes through unitless values', () => {
    const r = convertUnit(3, 'cloves', 'us')
    expect(r.unit).toBe('cloves')
    expect(r.quantity).toBe(3)
  })
})

describe('formatQuantity', () => {
  it('formats whole numbers', () => {
    expect(formatQuantity(2)).toBe('2')
  })
  it('formats half as fraction', () => {
    expect(formatQuantity(0.5)).toBe('½')
  })
  it('formats mixed number', () => {
    expect(formatQuantity(1.5)).toBe('1 ½')
  })
  it('formats quarter', () => {
    expect(formatQuantity(0.25)).toBe('¼')
  })
})
