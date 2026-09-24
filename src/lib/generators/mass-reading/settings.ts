// Mass Reading's settings, as they appear in the page address.

import { figureTextFields } from '$lib/shared/figureText'
import { MAGNIFIER_VIEWS } from '$lib/shared/magnify'
import { choice, defineSettings, number } from '$lib/shared/settings'
import { PAN_CONTENTS, digitalBalance, randomMass, roundMass, type DecimalPlaces } from './digital'
import { TRIPLE_BEAM_CAPACITY, TRIPLE_BEAM_DECIMALS, randomTripleBeamMass, roundTripleBeam } from './tripleBeam'

export const MASS_INSTRUMENTS = ['digital', 'triple-beam'] as const
export type MassInstrument = (typeof MASS_INSTRUMENTS)[number]

export const massSettings = defineSettings(
  {
    instrument: choice(MASS_INSTRUMENTS, 'digital'),
    decimals: number({ min: 1, max: 4, fallback: 2 }),
    pan: choice(PAN_CONTENTS, 'boat'),
    mass: number({ min: 0, max: 1000, fallback: 24.73 }),
    view: choice(MAGNIFIER_VIEWS, 'both'),
    span: number({ min: 1, max: 6, fallback: 3 }),
    ...figureTextFields(),
  },
  (s) => {
    const fixed = { ...s, decimals: Math.round(s.decimals), span: Math.round(s.span) }
    return { ...fixed, mass: massRules(fixed).round(s.mass) }
  },
)

export type MassSettings = typeof massSettings.defaults

interface MassRules {
  decimals: number
  capacity: number
  round: (grams: number) => number
  random: () => number
}

/** What counts as a mass on the chosen balance. */
export function massRules(s: { instrument: MassInstrument; decimals: number }): MassRules {
  if (s.instrument === 'triple-beam') {
    return { decimals: TRIPLE_BEAM_DECIMALS, capacity: TRIPLE_BEAM_CAPACITY, round: roundTripleBeam, random: () => randomTripleBeamMass() }
  }
  const balance = digitalBalance(s.decimals as DecimalPlaces)
  return {
    decimals: balance.decimals,
    capacity: balance.capacity,
    round: (g: number) => roundMass(balance, g),
    random: () => randomMass(balance),
  }
}

export const massText = (s: MassSettings) => s.mass.toFixed(massRules(s).decimals)

/** The answer key line, e.g. "Mass: 24.73 g". */
export const answerLine = (s: MassSettings) => `Mass: ${massText(s)} g`
