import { describe, expect, it } from 'vitest'
import { particleSettings } from './settings'

describe('key settings in the address', () => {
  it('are left out of the address at their defaults', () => {
    expect(particleSettings.toQuery(particleSettings.defaults)).toBe('')
  })

  it('an old link without key settings opens unchanged, with the box only', () => {
    const old = new URLSearchParams(
      'particles=' + JSON.stringify([{ count: 3, look: { size: 'm', shade: 'gray', charge: '' } }]) + '&seed=9',
    )
    const s = particleSettings.fromParams(old)
    expect(s.show).toBe('box')
    expect(s.keyNote).toBe('')
    expect(s.particles).toEqual([{ count: 3, look: { size: 'm', shade: 'gray', charge: '' } }])
    expect(particleSettings.toQuery(s)).toBe(old.toString())
  })

  it('travel in the address', () => {
    const d = particleSettings.defaults
    const s = { ...d, show: 'both' as const, keyNote: 'H₂O molecules are not shown', particles: [{ ...d.particles[0], name: 'Cl⁻' }, d.particles[1]] }
    expect(particleSettings.fromParams(new URLSearchParams(particleSettings.toQuery(s)))).toEqual(s)
  })

  it('clip the note to 80 characters', () => {
    expect(particleSettings.fromParams(new URLSearchParams('keyNote=' + 'x'.repeat(100))).keyNote).toHaveLength(80)
  })
})
