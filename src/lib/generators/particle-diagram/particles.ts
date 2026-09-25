// What a particle diagram is drawn from: a short list of particle kinds, each
// a count and a look (a size, a shade and, for an ion, a charge), and the
// tidying that turns anything stored or linked into valid ones. See
// CONTEXT.md for atom, ion and particle.

export const SIZES = ['xs', 's', 'm', 'l', 'xl'] as const
export type Size = (typeof SIZES)[number]

export const RADIUS: Record<Size, number> = { xs: 6, s: 10, m: 15, l: 20, xl: 26 }
export const SIZE_NAMES: Record<Size, string> = { xs: 'XS', s: 'S', m: 'M', l: 'L', xl: 'XL' }
const SIZE_WORDS: Record<Size, string> = { xs: 'tiny', s: 'small', m: 'medium', l: 'large', xl: 'extra large' }

export const SHADES = ['white', 'light', 'gray', 'dark', 'black'] as const
export type Shade = (typeof SHADES)[number]

export const SHADE_NAMES: Record<Shade, string> = {
  white: 'White',
  light: 'Light gray',
  gray: 'Gray',
  dark: 'Dark gray',
  black: 'Black',
}
export const SHADE_FILL: Record<Shade, string> = {
  white: '#fff',
  light: '#dcdcdc',
  gray: '#a3a3a3',
  dark: '#5c5c5c',
  black: '#111',
}
/** Shades a charge is written on in white. */
export const DARK_SHADES: readonly Shade[] = ['dark', 'black']

/** Charges are kept with plain hyphens, so links stay readable, and drawn
 *  with a true minus sign. Empty for an atom. */
export const CHARGES = ['', '+', '-', '2+', '2-', '3+', '3-'] as const
export type Charge = (typeof CHARGES)[number]

export const chargeText = (charge: Charge) => charge.replace('-', '−')

export interface Look {
  size: Size
  shade: Shade
  charge: Charge
}

export interface ParticleKind {
  /** how many are drawn in the box */
  count: number
  look: Look
  /** what the key calls it; kept only when not empty */
  name?: string
}

export const MAX_KINDS = 4
export const MAX_COUNT = 60
export const MAX_NAME = 40

/** "Ion" or "Atom", from whether the kind carries a charge. */
export const kindName = (kind: ParticleKind) => (kind.look.charge ? 'Ion' : 'Atom')

/** e.g. "large light gray −" */
export const describeLook = (look: Look) =>
  [SIZE_WORDS[look.size], SHADE_NAMES[look.shade].toLowerCase(), chargeText(look.charge)].filter(Boolean).join(' ')

// Tidying ------------------------------------------------------------------

const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
const oneOf = <T extends string>(options: readonly T[], v: unknown, fallback: T) =>
  options.includes(v as T) ? (v as T) : fallback

export function tidyLook(v: unknown): Look {
  const raw = isObject(v) ? v : {}
  return { size: oneOf(SIZES, raw.size, 'm'), shade: oneOf(SHADES, raw.shade, 'white'), charge: oneOf(CHARGES, raw.charge, '') }
}

export function tidyKind(v: unknown): ParticleKind | undefined {
  if (!isObject(v)) return undefined
  const count = typeof v.count === 'number' && Number.isFinite(v.count) ? Math.round(v.count) : 1
  const kind: ParticleKind = { count: Math.min(MAX_COUNT, Math.max(0, count)), look: tidyLook(v.look) }
  const name = typeof v.name === 'string' ? v.name.slice(0, MAX_NAME) : ''
  if (name.trim()) kind.name = name
  return kind
}

/** Up to four valid kinds, or undefined when there are none at all. */
export function tidyKinds(v: unknown): ParticleKind[] | undefined {
  if (!Array.isArray(v)) return undefined
  const kinds = v.map(tidyKind).filter((k): k is ParticleKind => !!k)
  return kinds.length ? kinds.slice(0, MAX_KINDS) : undefined
}

// Drawing ------------------------------------------------------------------

/** One disc as drawn, centered at (x, y). */
export interface Disc extends Look {
  x: number
  y: number
  r: number
}

/** A particle's discs around (0, 0), turned by `angle` radians. */
export function particleDiscs(kind: ParticleKind, angle = 0): Disc[] {
  void angle // a lone atom or ion looks the same whichever way it's turned
  return [{ ...kind.look, x: 0, y: 0, r: RADIUS[kind.look.size] }]
}
