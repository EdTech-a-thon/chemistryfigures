import { describe, expect, it } from 'vitest'
import { magnifierView, volumeSettings } from './settings'

describe('the magnifier for each instrument', () => {
  it('a beaker has none unless the teacher turns it on', () => {
    const beaker = volumeSettings.fromParams(new URLSearchParams('instrument=beaker'))
    expect(magnifierView(beaker)).toBe('whole')
    expect(magnifierView({ ...beaker, beakerView: 'both' })).toBe('both')
  })

  it('a cylinder or buret keeps its own, and the beaker’s doesn’t change it', () => {
    const cylinder = volumeSettings.defaults
    expect(magnifierView(cylinder)).toBe('both')
    expect(magnifierView({ ...cylinder, beakerView: 'magnifier' })).toBe('both')
    expect(magnifierView({ ...cylinder, instrument: 'buret', view: 'magnifier' })).toBe('magnifier')
  })

  it('old links without a beaker setting open unchanged', () => {
    expect(volumeSettings.toQuery(volumeSettings.fromParams(new URLSearchParams('view=whole&reading=12')))).toBe('reading=12&view=whole')
  })
})
