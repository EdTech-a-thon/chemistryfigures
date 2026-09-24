// Volume Reading's settings, as they appear in the page address.

import { choice, defineSettings, number } from '$lib/shared/settings'
import { CYLINDER_SIZES, roundReading, volumeScale } from './scale'

export const volumeSettings = defineSettings(
  {
    size: choice(CYLINDER_SIZES, '100'),
    reading: number({ min: 0, max: 100, fallback: 43.6 }),
  },
  (s) => ({ ...s, reading: roundReading(volumeScale('cylinder', s.size), s.reading) }),
)

export type VolumeSettings = typeof volumeSettings.defaults
