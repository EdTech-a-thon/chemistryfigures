// Volume Reading's settings, as they appear in the page address.

import { MAGNIFIER_VIEWS } from '$lib/shared/magnify'
import { choice, defineSettings, number } from '$lib/shared/settings'
import { CYLINDER_SIZES, roundReading, volumeScale } from './scale'

export const volumeSettings = defineSettings(
  {
    size: choice(CYLINDER_SIZES, '100'),
    reading: number({ min: 0, max: 100, fallback: 43.6 }),
    view: choice(MAGNIFIER_VIEWS, 'both'),
    span: number({ min: 1, max: 6, fallback: 3 }),
  },
  (s) => ({ ...s, reading: roundReading(volumeScale('cylinder', s.size), s.reading), span: Math.round(s.span) }),
)

export type VolumeSettings = typeof volumeSettings.defaults
