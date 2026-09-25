// Volume Reading's settings, as they appear in the page address.

import { figureTextFields } from '$lib/shared/figureText'
import { MAGNIFIER_VIEWS } from '$lib/shared/magnify'
import { choice, defineSettings, number } from '$lib/shared/settings'
import { LIQUID_TINTS } from './liquid'
import { BEAKER_SIZES, CYLINDER_SIZES, INSTRUMENTS, formatReading, roundReading, volumeScale } from './scale'

export const volumeSettings = defineSettings(
  {
    instrument: choice(INSTRUMENTS, 'cylinder'),
    size: choice(CYLINDER_SIZES, '100'),
    beaker: choice(BEAKER_SIZES, 'medium'),
    reading: number({ min: 0, max: 600, fallback: 43.6 }),
    view: choice(MAGNIFIER_VIEWS, 'both'),
    span: number({ min: 1, max: 6, fallback: 3 }),
    tint: choice(LIQUID_TINTS, 'gray'),
    ...figureTextFields(),
  },
  (s) => ({ ...s, reading: roundReading(volumeScale(s), s.reading), span: Math.round(s.span) }),
)

export type VolumeSettings = typeof volumeSettings.defaults

/** The answer key line, e.g. "Reading: 23.47 mL". */
export const answerLine = (s: VolumeSettings) =>
  `Reading: ${formatReading(volumeScale(s), s.reading)} mL`
