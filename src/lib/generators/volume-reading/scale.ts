// The scale printed on each volume instrument, and what counts as a valid
// reading on it: one digit beyond the smallest mark (the estimated digit).

export const INSTRUMENTS = ['cylinder', 'buret'] as const
export type Instrument = (typeof INSTRUMENTS)[number]

export const CYLINDER_SIZES = ['10', '25', '50', '100'] as const
export type CylinderSize = (typeof CYLINDER_SIZES)[number]

export interface Scale {
  capacity: number
  /** mL between numbered marks */
  labelEvery: number
  /** mL between the smallest marks */
  minorEvery: number
  /** decimal places in a reading */
  decimals: number
  /** true when 0 is at the top and readings grow downward (a buret) */
  readsDown: boolean
}

// Numbered every tenth of capacity. The 50 mL cylinder has 1 mL marks, like
// real ones, rather than 0.5 mL.
const CYLINDERS: Record<CylinderSize, Omit<Scale, 'decimals' | 'readsDown'>> = {
  '10': { capacity: 10, labelEvery: 1, minorEvery: 0.1 },
  '25': { capacity: 25, labelEvery: 2.5, minorEvery: 0.25 },
  '50': { capacity: 50, labelEvery: 5, minorEvery: 1 },
  '100': { capacity: 100, labelEvery: 10, minorEvery: 1 },
}

/** Decimal places that reach one digit past the smallest mark: 1 → 1, 0.1 → 2, 0.25 → 2. */
const estimatedDecimals = (minorEvery: number) => Math.max(0, Math.ceil(-Math.log10(minorEvery) - 1e-9)) + 1

export function volumeScale(instrument: Instrument, size: CylinderSize): Scale {
  const marks = instrument === 'buret' ? { capacity: 50, labelEvery: 1, minorEvery: 0.1 } : CYLINDERS[size]
  return { ...marks, decimals: estimatedDecimals(marks.minorEvery), readsDown: instrument === 'buret' }
}

export function roundReading(scale: Scale, value: number): number {
  const clamped = Math.min(scale.capacity, Math.max(0, value))
  return Number(clamped.toFixed(scale.decimals))
}

export const formatReading = (scale: Scale, value: number) => value.toFixed(scale.decimals)

/** A reading a teacher might set: away from the very ends of a buret, and a
 *  cylinder neither nearly empty nor nearly full. */
export function randomReading(scale: Scale, random: () => number = Math.random): number {
  const [low, high] = scale.readsDown ? [0.01, 0.99] : [0.15, 0.9]
  return roundReading(scale, scale.capacity * (low + random() * (high - low)))
}
