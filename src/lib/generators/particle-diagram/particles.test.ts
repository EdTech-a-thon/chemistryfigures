import { describe, expect, it } from 'vitest'
import { chargeText, kindName, tidyKinds, type ParticleKind } from './particles'

const ion: ParticleKind = { count: 4, look: { size: 'l', shade: 'light', charge: '-' } }

describe('particle kinds from the address or storage', () => {
  it('keeps valid kinds as they are', () => {
    expect(tidyKinds([ion])).toEqual([ion])
  })

  it('fills in what it does not understand', () => {
    expect(tidyKinds([{ count: 'x', look: { size: 'huge', shade: 'pink', charge: '9+' } }])).toEqual([
      { count: 1, look: { size: 'm', shade: 'white', charge: '' } },
    ])
  })

  it('rounds and limits counts to 0–60', () => {
    expect(tidyKinds([{ ...ion, count: 2.6 }])![0].count).toBe(3)
    expect(tidyKinds([{ ...ion, count: -3 }])![0].count).toBe(0)
    expect(tidyKinds([{ ...ion, count: 500 }])![0].count).toBe(60)
  })

  it('keeps at most four kinds, and rejects anything that is not a list', () => {
    expect(tidyKinds(Array(6).fill(ion))).toHaveLength(4)
    expect(tidyKinds([])).toBeUndefined()
    expect(tidyKinds({ count: 1 })).toBeUndefined()
    expect(tidyKinds(['x', ion])).toEqual([ion])
  })

  it('keeps a key name, clipped to 40 characters', () => {
    expect(tidyKinds([{ ...ion, name: 'Any negative ion' }])![0].name).toBe('Any negative ion')
    expect(tidyKinds([{ ...ion, name: 'x'.repeat(50) }])![0].name).toBe('x'.repeat(40))
  })

  it('leaves out an empty or unusable key name, so kinds without one are unchanged', () => {
    for (const name of ['', '   ', 7, null]) expect(tidyKinds([{ ...ion, name }])).toEqual([ion])
    expect(JSON.stringify(tidyKinds([ion]))).toBe(JSON.stringify([ion]))
  })
})

describe('naming and labeling', () => {
  it('a kind with a charge is an ion, without one an atom', () => {
    expect(kindName(ion)).toBe('Ion')
    expect(kindName({ ...ion, look: { ...ion.look, charge: '' } })).toBe('Atom')
  })

  it('writes charges with a true minus sign', () => {
    expect(chargeText('2-')).toBe('2−')
    expect(chargeText('+')).toBe('+')
    expect(chargeText('')).toBe('')
  })
})
