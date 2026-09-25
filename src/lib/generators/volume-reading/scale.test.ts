import { describe, expect, it } from 'vitest'
import { formatReading, randomReading, roundReading, volumeScale } from './scale'

describe('graduated cylinder marks', () => {
  it.each([
    ['10', 10, 1, 0.1, 2],
    ['25', 25, 5, 0.25, 2],
    ['50', 50, 10, 1, 1],
    ['100', 100, 10, 1, 1],
  ] as const)('%s mL: labeled every %s, minor every %s, read to %s decimals', (size, capacity, label, minor, decimals) => {
    const s = volumeScale({ instrument: 'cylinder', size, beaker: 'medium' })
    expect(s).toMatchObject({ capacity, labelEvery: label, minorEvery: minor, decimals, readsDown: false })
  })
})

describe('buret marks', () => {
  it('is 50 mL read downward, labeled every 1 mL, minor every 0.1, read to 0.01', () => {
    expect(volumeScale({ instrument: 'buret', size: '10', beaker: 'medium' })).toEqual({ capacity: 50, labelEvery: 1, minorEvery: 0.1, decimals: 2, readsDown: true })
  })
})

describe('beaker marks', () => {
  it.each([
    ['small', 50, 10, 10],
    ['medium', 250, 50, 25],
    ['large', 600, 100, 50],
  ] as const)('%s is %s mL, labeled every %s, minor every %s, read to the whole mL', (beaker, capacity, label, minor) => {
    const s = volumeScale({ instrument: 'beaker', size: '100', beaker })
    expect(s).toEqual({ capacity, labelEvery: label, minorEvery: minor, decimals: 0, readsDown: false })
  })
})

describe('the reading', () => {
  const cyl100 = volumeScale({ instrument: 'cylinder', size: '100', beaker: 'medium' })
  const buret = volumeScale({ instrument: 'buret', size: '100', beaker: 'medium' })
  const beaker = volumeScale({ instrument: 'beaker', size: '100', beaker: 'large' })

  it('rounds to the estimated digit', () => {
    expect(roundReading(cyl100, 43.27)).toBe(43.3)
    expect(roundReading(buret, 23.475)).toBe(23.48)
    expect(roundReading(buret, 0.004)).toBe(0)
    expect(roundReading(beaker, 347.6)).toBe(348)
  })

  it('stays within the instrument', () => {
    expect(roundReading(cyl100, 140)).toBe(100)
    expect(roundReading(buret, -2)).toBe(0)
  })

  it('is written with every decimal place, including trailing zeros', () => {
    expect(formatReading(buret, 23.4)).toBe('23.40')
    expect(formatReading(cyl100, 40)).toBe('40.0')
    expect(formatReading(beaker, 350)).toBe('350')
  })

  it('can be picked at random, always a valid reading', () => {
    for (const r of [0, 0.3, 0.999999]) {
      const v = randomReading(buret, () => r)
      expect(v).toBe(roundReading(buret, v))
      expect(v).toBeGreaterThan(0)
      expect(v).toBeLessThan(50)
    }
    expect(randomReading(cyl100, () => 0.5)).toBe(52.5)
  })
})
