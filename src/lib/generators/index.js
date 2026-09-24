// Every generator on the site. The directory and its search, page titles
// and the sitemap all read this list, so adding a generator means adding its
// folder and one entry here.

import VolumeReadingPreview from './volume-reading/Preview.svelte'

/**
 * @typedef {object} Generator
 * @property {string} id
 * @property {string} name        display name, e.g. "Volume Reading" (the page title adds "Generator")
 * @property {string} path        its address on the site
 * @property {string} blurb       one line for the directory card
 * @property {string} description the page's search engine description
 * @property {string[]} keywords  words teachers might search for instead of the name
 * @property {any} Preview        component drawing a sample figure
 */

/** @type {Generator[]} */
export const GENERATORS = [
  {
    id: 'volume-reading',
    name: 'Volume Reading',
    path: '/volume-reading',
    blurb: 'A graduated cylinder or buret showing the volume you type, with a magnified view of the meniscus.',
    description:
      'Make printable graduated cylinder and buret figures for chemistry tests. Type a volume and students read it from the meniscus, with a magnified view for the estimated digit.',
    keywords: ['graduated', 'cylinder', 'buret', 'burette', 'meniscus', 'volume', 'mL', 'milliliters', 'measurement', 'lab', 'glassware'],
    Preview: VolumeReadingPreview,
  },
]

export const findGenerator = (path) => GENERATORS.find((g) => g.path === path)

const words = (text) => text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)

/** Generators matching a search. Every word typed must start some word in the
 *  generator's name, blurb or keywords, so "grad cyl" finds Volume Reading. */
export function searchGenerators(query) {
  const wanted = words(query)
  if (!wanted.length) return GENERATORS
  return GENERATORS.filter((g) => {
    const have = words([g.name, g.blurb, ...g.keywords].join(' '))
    return wanted.every((w) => have.some((h) => h.startsWith(w)))
  })
}
