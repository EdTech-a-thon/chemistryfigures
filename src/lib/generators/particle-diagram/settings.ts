// Particle Diagram's settings, as they appear in the page address.

import { choice, defineSettings, json, number, text } from '$lib/shared/settings'
import { scatter } from './layout'
import { DEFAULT_OUTER, tidyKinds, type ParticleKind } from './particles'

export const BORDERS = ['single', 'double', 'none'] as const
export type Border = (typeof BORDERS)[number]

/** The box is always this square, whatever is in it, so answer choices made
 *  one at a time line up (see CONTEXT.md "Box"). */
export const BOX_SIDE = 300

/** How far a double border's inner line sits inside the outer one. */
export const DOUBLE_INSET = 6

export const MAX_SEED = 999999

/** What the figure shows: the box, the box and its key, or just the key
 *  (so answer choices made one at a time can share one key). */
export const SHOWS = ['box', 'both', 'key'] as const
export type Show = (typeof SHOWS)[number]

export const MAX_NOTE = 80

const DEFAULT_KINDS: ParticleKind[] = [
  { count: 4, shape: 'single', look: { size: 'l', shade: 'light', charge: '-' }, outer: { ...DEFAULT_OUTER } },
  { count: 4, shape: 'single', look: { size: 's', shade: 'white', charge: '+' }, outer: { ...DEFAULT_OUTER } },
]

export const particleSettings = defineSettings(
  {
    particles: json(DEFAULT_KINDS, tidyKinds),
    seed: number({ min: 1, max: MAX_SEED, fallback: 2 }),
    border: choice(BORDERS, 'single'),
    show: choice(SHOWS, 'box'),
    keyNote: text('', MAX_NOTE),
    titleMode: choice(['none', 'text'] as const, 'none'),
    title: text(''),
  },
  (s) => ({ ...s, seed: Math.round(s.seed) }),
)

export type ParticleSettings = typeof particleSettings.defaults

/** A seed for a new random layout. */
export const newSeed = () => 1 + Math.floor(Math.random() * MAX_SEED)

/** The particles scattered in the box for these settings, inside the inner
 *  line of a double border, and how many didn't fit. */
export function boxParticles(s: ParticleSettings) {
  const inset = s.border === 'double' ? DOUBLE_INSET : 0
  const { discs, missing } = scatter(s.particles, BOX_SIDE - 2 * inset, BOX_SIDE - 2 * inset, s.seed)
  return { discs: discs.map((d) => ({ ...d, x: d.x + inset, y: d.y + inset })), missing }
}
