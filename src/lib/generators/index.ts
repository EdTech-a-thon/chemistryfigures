// Every generator on the site. The directory and its search, page titles
// and the sitemap all read this list, so adding a generator means adding its
// folder and one entry here.

import type { Component } from 'svelte'
import MassReadingPreview from './mass-reading/Preview.svelte'
import ParticleDiagramPreview from './particle-diagram/Preview.svelte'
import VolumeReadingPreview from './volume-reading/Preview.svelte'

export interface Generator {
  id: string
  /** display name, e.g. "Volume Reading" (the page title adds "Generator") */
  name: string
  /** its address on the site */
  path: string
  /** one line for the directory card */
  blurb: string
  /** the page's search engine description */
  description: string
  /** words teachers might search for instead of the name */
  keywords: string[]
  /** component drawing a sample figure */
  Preview: Component
}

export const GENERATORS: Generator[] = [
  {
    id: 'volume-reading',
    name: 'Volume Reading',
    path: '/volume-reading',
    blurb: 'A graduated cylinder or buret showing the volume you type.',
    description:
      'Make printable graduated cylinder and buret figures for chemistry tests. Type a volume and students read it from the meniscus, with a magnified view for the estimated digit.',
    keywords: ['graduated', 'cylinder', 'buret', 'burette', 'meniscus', 'volume', 'mL', 'milliliters', 'measurement', 'lab', 'glassware'],
    Preview: VolumeReadingPreview,
  },
  {
    id: 'mass-reading',
    name: 'Mass Reading',
    path: '/mass-reading',
    blurb: 'A triple beam or digital balance showing the mass you type.',
    description:
      'Make printable balance figures for chemistry tests. Type a mass and get a digital, analytical or triple beam balance showing it, for students to read.',
    keywords: ['balance', 'scale', 'digital', 'analytical', 'electronic', 'triple', 'beam', 'mass', 'grams', 'weigh', 'weight', 'measurement', 'lab'],
    Preview: MassReadingPreview,
  },
  {
    id: 'particle-diagram',
    name: 'Particle Diagram',
    path: '/particle-diagram',
    blurb: 'Atoms, ions and molecules scattered in a box or packed in a lattice.',
    description:
      'Make printable particle diagrams for AP Chemistry tests. Pick the atoms, ions and molecules, their sizes, shades and charges, and how many of each, and get them scattered in a box or packed in an ionic or alloy lattice, with a key.',
    keywords: ['particulate', 'particles', 'atom', 'atoms', 'ion', 'ions', 'molecule', 'molecules', 'lattice', 'alloy', 'solid', 'liquid', 'gas', 'solution', 'ionic', 'AP', 'diagram', 'model', 'representation'],
    Preview: ParticleDiagramPreview,
  },
]

export const findGenerator = (path: string) => GENERATORS.find((g) => g.path === path)

const words = (text: string) => text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)

/** Generators matching a search. Every word typed must start some word in the
 *  generator's name, blurb or keywords, so "grad cyl" finds Volume Reading. */
export function searchGenerators(query: string) {
  const wanted = words(query)
  if (!wanted.length) return GENERATORS
  return GENERATORS.filter((g) => {
    const have = words([g.name, g.blurb, ...g.keywords].join(' '))
    return wanted.every((w) => have.some((h) => h.startsWith(w)))
  })
}
