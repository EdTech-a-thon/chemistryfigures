import { describe, expect, it } from 'vitest'
import { findGenerator, searchGenerators } from './index'

const ids = (query: string) => searchGenerators(query).map((g) => g.id)

describe('searching the directory', () => {
  it('finds Volume by Displacement the ways teachers ask for it', () => {
    for (const query of ['water displacement', 'displacement', 'marble', 'rock', 'object volume'])
      expect(ids(query)).toContain('volume-by-displacement')
  })

  it('finds Orbital Diagram the ways teachers ask for it', () => {
    for (const query of ['electron configuration', 'orbital notation', 'box diagram', 'aufbau', 'hund', 'pauli', 'noble gas'])
      expect(ids(query)).toContain('orbital-diagram')
  })

  it('matches word starts, so "grad cyl" finds the graduated cylinder generators', () => {
    expect(ids('grad cyl')).toEqual(expect.arrayContaining(['volume-reading', 'volume-by-displacement']))
  })

  it('finds a generator by its path', () => {
    expect(findGenerator('/volume-by-displacement')?.name).toBe('Volume by Displacement')
  })
})
