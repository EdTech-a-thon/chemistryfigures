import { describe, expect, it } from 'vitest'
import { SCATTER_GAP, scatter, seededRandom } from './layout'
import type { ParticleKind } from './particles'

const kinds: ParticleKind[] = [
  { count: 6, look: { size: 'l', shade: 'light', charge: '-' } },
  { count: 6, look: { size: 's', shade: 'white', charge: '+' } },
]

describe('seeded random numbers', () => {
  it('repeat for the same seed and differ for another', () => {
    const a = seededRandom(5)
    const b = seededRandom(5)
    const first = [a(), a(), a()]
    expect([b(), b(), b()]).toEqual(first)
    expect(seededRandom(6)()).not.toBe(first[0])
    expect(first.every((n) => n >= 0 && n < 1)).toBe(true)
  })
})

describe('scattering particles in the box', () => {
  it('draws the same layout for the same seed', () => {
    expect(scatter(kinds, 300, 300, 11)).toEqual(scatter(kinds, 300, 300, 11))
    expect(scatter(kinds, 300, 300, 11)).not.toEqual(scatter(kinds, 300, 300, 12))
  })

  it('places every particle, apart from each other and the box edge', () => {
    const { discs, missing } = scatter(kinds, 300, 300, 3)
    expect(missing).toBe(0)
    expect(discs).toHaveLength(12)
    for (const d of discs) {
      expect(d.x - d.r).toBeGreaterThanOrEqual(SCATTER_GAP)
      expect(d.y - d.r).toBeGreaterThanOrEqual(SCATTER_GAP)
      expect(d.x + d.r).toBeLessThanOrEqual(300 - SCATTER_GAP)
      expect(d.y + d.r).toBeLessThanOrEqual(300 - SCATTER_GAP)
    }
    for (const [i, a] of discs.entries()) {
      for (const b of discs.slice(i + 1)) expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(a.r + b.r + SCATTER_GAP)
    }
  })

  it('counts the particles that find no room', () => {
    const crowd: ParticleKind[] = [{ count: 60, look: { size: 'xl', shade: 'gray', charge: '' } }]
    const { discs, missing } = scatter(crowd, 300, 300, 1)
    expect(missing).toBeGreaterThan(0)
    expect(discs.length + missing).toBe(60)
  })

  it('draws nothing for a kind with a count of 0', () => {
    expect(scatter([{ ...kinds[0], count: 0 }], 300, 300, 1)).toEqual({ discs: [], missing: 0 })
  })
})
