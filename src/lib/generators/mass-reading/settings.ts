// Mass Reading's settings, as they appear in the page address.

import { figureTextFields } from '$lib/shared/figureText'
import { choice, defineSettings, number } from '$lib/shared/settings'
import { PAN_CONTENTS, digitalBalance, displayText, roundMass, type DecimalPlaces } from './digital'

export const massSettings = defineSettings(
  {
    decimals: number({ min: 1, max: 4, fallback: 2 }),
    pan: choice(PAN_CONTENTS, 'boat'),
    mass: number({ min: 0, max: 1000, fallback: 24.73 }),
    ...figureTextFields(),
  },
  (s) => {
    const decimals = Math.round(s.decimals) as DecimalPlaces
    return { ...s, decimals, mass: roundMass(digitalBalance(decimals), s.mass) }
  },
)

export type MassSettings = typeof massSettings.defaults

export const balanceOf = (s: MassSettings) => digitalBalance(s.decimals as DecimalPlaces)

/** The answer key line, e.g. "Mass: 24.73 g". */
export const answerLine = (s: MassSettings) => `Mass: ${displayText(balanceOf(s), s.mass)} g`
