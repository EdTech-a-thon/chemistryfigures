// Volume by Displacement's settings, as they appear in the page address.

import { figureTextFields } from '$lib/shared/figureText'
import { choice, defineSettings, number, text } from '$lib/shared/settings'
import { LIQUID_TINTS } from '../volume-reading/liquid'
import { CYLINDER_SIZES, formatReading, volumeScale, type CylinderSize } from '../volume-reading/scale'
import { displacedVolume, fixReadings } from './readings'

export const cylinderScale = (size: CylinderSize) => volumeScale('cylinder', size)

export const displacementSettings = defineSettings(
  {
    size: choice(CYLINDER_SIZES, '10'),
    before: number({ min: 0, max: 100, fallback: 4 }),
    after: number({ min: 0, max: 100, fallback: 6 }),
    tint: choice(LIQUID_TINTS, 'gray'),
    beforeCaption: text('Before', 40),
    afterCaption: text('After', 40),
    ...figureTextFields(),
  },
  (s) => ({ ...s, ...fixReadings(cylinderScale(s.size), s.before, s.after) }),
)

export type DisplacementSettings = typeof displacementSettings.defaults

/** The answer key line, e.g. "Before: 4.00 mL · After: 6.00 mL · Object: 2.00 mL". */
export function answerLine(s: DisplacementSettings) {
  const scale = cylinderScale(s.size)
  const mL = (v: number) => `${formatReading(scale, v)} mL`
  return `Before: ${mL(s.before)} · After: ${mL(s.after)} · Object: ${mL(displacedVolume(scale, s))}`
}
