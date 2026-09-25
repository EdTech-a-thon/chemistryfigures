// Lewis Structures' settings, as they appear in the page address, and what
// the figure shows for them.

import { bool, choice, defineSettings, number, text } from '$lib/shared/settings'
import { RULES } from './build'
import { applyChanges, changesField } from './changes'
import { findMistakes } from './check'
import { SHAPES } from './layout'
import { aroundCentral, resolve, type Resolved } from './resolve'
import type { Structure } from './structure'

/** How much of the structure a "complete this" question gives the student
 *  (see CONTEXT.md "Scaffold"). */
export const SCAFFOLDS = ['full', 'bonds', 'skeleton', 'formula'] as const
export type Scaffold = (typeof SCAFFOLDS)[number]

/** One resonance structure, or all of them joined by ↔. */
export const RESONANCES = ['one', 'all'] as const
export type Resonance = (typeof RESONANCES)[number]

export const MAX_FORMULA = 40
const MAX_FORMS = 12

export const lewisSettings = defineSettings(
  {
    formula: text('H2O', MAX_FORMULA),
    which: text('', MAX_FORMULA),
    rule: choice(RULES, 'octet'),
    resonance: choice(RESONANCES, 'one'),
    form: number({ min: 1, max: MAX_FORMS, fallback: 1 }),
    shape: choice(SHAPES, 'flat'),
    formalCharges: bool(false),
    scaffold: choice(SCAFFOLDS, 'full'),
    central: text('', 2),
    changes: changesField(),
    answerKey: bool(false),
    titleMode: choice(['none', 'text'] as const, 'none'),
    title: text(''),
  },
  // A changed structure is one structure, drawn in full: a figure is either
  // a "complete this" question or a "find the mistake" one.
  (s) => {
    const changed = s.changes.length > 0 || s.central !== ''
    return { ...s, form: Math.round(s.form), ...(changed ? { scaffold: 'full' as const, resonance: 'one' as const } : {}) }
  },
)

export type LewisSettings = typeof lewisSettings.defaults

export interface Figure {
  resolved: Resolved
  /** the structure changes start from, when there is one */
  start?: Structure
  /** the structures drawn, left to right: several for all resonance structures */
  shown: Structure[]
  /** whether the teacher changed the structure */
  changed: boolean
  /** a changed structure's mistakes */
  mistakes: string[]
  /** what the answer key under the figure shows */
  key: { kind: 'none' } | { kind: 'structures'; structures: Structure[] } | { kind: 'mistakes'; mistakes: string[] }
}

export function figureOf(s: LewisSettings): Figure {
  const resolved = resolve(s)
  if (!resolved.ok) return { resolved, shown: [], changed: false, mistakes: [], key: { kind: 'none' } }

  const forms = resolved.correct
  const form = forms[Math.min(s.form, forms.length) - 1]
  const around = s.central ? aroundCentral(resolved, s.central, s.rule, s.shape) : undefined
  const start = around?.structure ?? form
  const changed = s.changes.length > 0 || around !== undefined
  const shown = changed ? [applyChanges(start, s.changes)] : s.resonance === 'all' ? forms : [form]

  const mistakes = changed
    ? findMistakes({ structure: shown[0], correct: forms, name: resolved.name, rule: s.rule, formalCharges: s.formalCharges, shouldBeCentral: around?.shouldBe })
    : []
  const key: Figure['key'] = !s.answerKey
    ? { kind: 'none' }
    : changed
      ? { kind: 'mistakes', mistakes }
      : s.scaffold !== 'full'
        ? { kind: 'structures', structures: shown }
        : { kind: 'none' }
  return { resolved, start, shown, changed, mistakes, key }
}
