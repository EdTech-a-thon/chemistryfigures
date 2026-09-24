// The liquid inside a volume instrument: its color, and the shape of its
// meniscus (the curved surface, read at its bottom).

export const LIQUID_TINTS = ['gray', 'blue', 'red', 'green'] as const
export type LiquidTint = (typeof LIQUID_TINTS)[number]

/** Gray prints well on a photocopier; the colors are for slides. */
export const LIQUID_COLORS: Record<LiquidTint, { fill: string; surface: string }> = {
  gray: { fill: '#dcdcdc', surface: '#444' },
  blue: { fill: '#bfdbfe', surface: '#1d4ed8' },
  red: { fill: '#fecaca', surface: '#b91c1c' },
  green: { fill: '#bbf7d0', surface: '#15803d' },
}

/** The meniscus from the left wall to the right: it climbs `depth` up each
 *  wall and is flat across the middle, its bottom exactly at `y`. */
export function meniscusCurve(left: number, right: number, y: number, depth: number) {
  const w = right - left
  const top = y - depth
  return (
    `M ${left} ${top} C ${left + 0.02 * w} ${y - 0.25 * depth} ${left + 0.12 * w} ${y} ${left + 0.32 * w} ${y} ` +
    `L ${right - 0.32 * w} ${y} C ${right - 0.12 * w} ${y} ${right - 0.02 * w} ${y - 0.25 * depth} ${right} ${top}`
  )
}
