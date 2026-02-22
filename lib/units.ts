export type UnitSystem = 'metric' | 'us'

interface UnitConversion {
  factor: number      // multiply metric value by this to get US
  metricUnit: string
  usUnit: string
}

const conversions: UnitConversion[] = [
  { factor: 1 / 240,   metricUnit: 'ml',  usUnit: 'cups'  },
  { factor: 1 / 15,    metricUnit: 'ml',  usUnit: 'tbsp'  },
  { factor: 1 / 5,     metricUnit: 'ml',  usUnit: 'tsp'   },
  { factor: 1 / 28.35, metricUnit: 'g',   usUnit: 'oz'    },
  { factor: 1 / 453.6, metricUnit: 'g',   usUnit: 'lb'    },
  { factor: 1 / 29.57, metricUnit: 'ml',  usUnit: 'fl oz' },
]

// Map from metric unit to US unit and conversion factor
const metricToUs: Record<string, { usUnit: string; factor: number }> = {}
const usToMetric: Record<string, { metricUnit: string; factor: number }> = {}

for (const c of conversions) {
  metricToUs[c.metricUnit] = metricToUs[c.metricUnit] ?? { usUnit: c.usUnit, factor: c.factor }
  usToMetric[c.usUnit] = { metricUnit: c.metricUnit, factor: 1 / c.factor }
}

// Preferred US representation for common metric amounts
function toUsUnit(quantity: number, unit: string): { quantity: number; unit: string } {
  const unitLower = unit.toLowerCase()

  if (unitLower === 'ml') {
    if (quantity >= 240) return { quantity: round(quantity / 240), unit: 'cups' }
    if (quantity >= 15)  return { quantity: round(quantity / 15),  unit: 'tbsp' }
    return { quantity: round(quantity / 5), unit: 'tsp' }
  }

  if (unitLower === 'g') {
    if (quantity >= 450) return { quantity: round(quantity / 453.6), unit: 'lb' }
    return { quantity: round(quantity / 28.35), unit: 'oz' }
  }

  if (unitLower === 'kg') {
    return { quantity: round(quantity * 2.205), unit: 'lb' }
  }

  if (unitLower === 'l' || unitLower === 'litre' || unitLower === 'liter') {
    return { quantity: round(quantity * 4.227), unit: 'cups' }
  }

  if (unitLower === '°c' || unitLower === 'c') {
    return { quantity: Math.round(quantity * 9 / 5 + 32), unit: '°F' }
  }

  // Already a US unit or unitless — pass through
  return { quantity, unit }
}

function toMetricUnit(quantity: number, unit: string): { quantity: number; unit: string } {
  const unitLower = unit.toLowerCase()

  if (unitLower === 'cups') return { quantity: round(quantity * 240), unit: 'ml' }
  if (unitLower === 'tbsp') return { quantity: round(quantity * 15),  unit: 'ml' }
  if (unitLower === 'tsp')  return { quantity: round(quantity * 5),   unit: 'ml' }
  if (unitLower === 'oz')   return { quantity: round(quantity * 28.35), unit: 'g' }
  if (unitLower === 'lb')   return { quantity: round(quantity * 453.6), unit: 'g' }
  if (unitLower === 'fl oz') return { quantity: round(quantity * 29.57), unit: 'ml' }
  if (unitLower === '°f')   return { quantity: Math.round((quantity - 32) * 5 / 9), unit: '°C' }

  return { quantity, unit }
}

export function convertUnit(
  quantity: number,
  unit: string,
  targetSystem: UnitSystem,
): { quantity: number; unit: string } {
  if (targetSystem === 'us') return toUsUnit(quantity, unit)
  return toMetricUnit(quantity, unit)
}

function round(n: number): number {
  if (n < 1) return Math.round(n * 8) / 8   // 1/8 precision for small fractions
  if (n < 10) return Math.round(n * 4) / 4  // 1/4 precision for under 10
  return Math.round(n * 2) / 2              // 1/2 precision for larger amounts
}

/** Format a quantity as a readable fraction/decimal string */
export function formatQuantity(n: number): string {
  if (n === 0) return '0'
  const whole = Math.floor(n)
  const frac = n - whole
  const fractionMap: Record<number, string> = {
    0.125: '⅛',
    0.25: '¼',
    0.333: '⅓',
    0.375: '⅜',
    0.5: '½',
    0.625: '⅝',
    0.667: '⅔',
    0.75: '¾',
    0.875: '⅞',
  }
  const rounded = Math.round(frac * 8) / 8
  const fracStr = fractionMap[Math.round(rounded * 1000) / 1000] ?? (frac > 0.05 ? frac.toFixed(1).replace(/\.?0+$/, '') : '')
  if (whole === 0) return fracStr || '0'
  if (!fracStr) return String(whole)
  return `${whole} ${fracStr}`
}
