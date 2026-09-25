// Volume by Displacement's settings, as they appear in the page address.

import { figureTextFields } from '$lib/shared/figureText'
import { choice, defineSettings, number, text } from '$lib/shared/settings'
import { cylinderLayout } from '../volume-reading/cylinder'
import { LIQUID_TINTS } from '../volume-reading/liquid'
import { CYLINDER_SIZES, formatReading, volumeScale, type CylinderSize } from '../volume-reading/scale'
import { AREA_PER_RISE, OBJECTS, drawnArea, placeObject } from './objects'
import { displacedVolume, fixReadings } from './readings'

export const cylinderScale = (size: CylinderSize) => volumeScale('cylinder', size)

export const displacementSettings = defineSettings(
  {
    size: choice(CYLINDER_SIZES, '10'),
    before: number({ min: 0, max: 100, fallback: 4 }),
    after: number({ min: 0, max: 100, fallback: 6 }),
    tint: choice(LIQUID_TINTS, 'gray'),
    object: choice(OBJECTS, 'marbles'),
    marbles: number({ min: 1, max: 5, fallback: 2 }),
    beforeCaption: text('Before', 40),
    afterCaption: text('After', 40),
    ...figureTextFields(),
  },
  (s) => ({ ...s, ...fixReadings(cylinderScale(s.size), s.before, s.after), marbles: Math.round(s.marbles) }),
)

export type DisplacementSettings = typeof displacementSettings.defaults

/** The answer key line, e.g. "Before: 4.00 mL · After: 6.00 mL · Object: 2.00 mL". */
export function answerLine(s: DisplacementSettings) {
  const scale = cylinderScale(s.size)
  const mL = (v: number) => `${formatReading(scale, v)} mL`
  return `Before: ${mL(s.before)} · After: ${mL(s.after)} · Object: ${mL(displacedVolume(scale, s))}`
}

/** The object in the after cylinder, in the cylinder's drawing units, and
 *  whether it had to be drawn smaller than its volume suggests to stay
 *  under water. */
export function objectInCylinder(s: DisplacementSettings) {
  const scale = cylinderScale(s.size)
  const at = cylinderLayout(scale, s.size)
  const inset = 3
  const room = { left: at.left + inset, right: at.right - inset, top: at.yOf(s.after) + 4, bottom: at.innerBottom - 1 }
  const area = AREA_PER_RISE * at.tubeW * displacedVolume(scale, s) * at.perMl
  const placed = placeObject(s.object, s.marbles, room, area)
  const unlimited = placeObject(s.object, s.marbles, { ...room, top: at.tubeTop }, area)
  return { placed, shrunk: drawnArea(placed) < drawnArea(unlimited) * 0.6 }
}
