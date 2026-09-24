// A digital balance: the display shows the mass to 1–4 decimal places of
// grams. The finer ones are analytical balances, which hold less and stand
// inside a draft shield.

export const DECIMAL_PLACES = [1, 2, 3, 4] as const
export type DecimalPlaces = (typeof DECIMAL_PLACES)[number]

export interface DigitalBalance {
  decimals: DecimalPlaces
  /** the most it can weigh, in grams */
  capacity: number
  analytical: boolean
}

const CAPACITY: Record<DecimalPlaces, number> = { 1: 1000, 2: 400, 3: 200, 4: 200 }

export function digitalBalance(decimals: DecimalPlaces): DigitalBalance {
  return { decimals, capacity: CAPACITY[decimals], analytical: decimals >= 3 }
}

export function roundMass(balance: DigitalBalance, grams: number): number {
  const clamped = Math.min(balance.capacity, Math.max(0, grams))
  return Number(clamped.toFixed(balance.decimals))
}

export const displayText = (balance: DigitalBalance, grams: number) => grams.toFixed(balance.decimals)

/** A mass a teacher might set: something that fits on the pan, from a
 *  fraction of a gram up to about half the balance's capacity. */
export function randomMass(balance: DigitalBalance, random: () => number = Math.random): number {
  const low = balance.analytical ? 0.05 : 1
  return Math.max(10 ** -balance.decimals, roundMass(balance, low + random() * (balance.capacity / 2 - low)))
}

export const PAN_CONTENTS = ['boat', 'beaker', 'empty'] as const
export type PanContents = (typeof PAN_CONTENTS)[number]

/** The drawing's size: taller when a beaker or a draft shield rises above the pan. */
export function digitalBalanceSize(analytical: boolean, pan: PanContents) {
  const top = analytical ? 10 : pan === 'beaker' ? 52 : pan === 'boat' ? 104 : 142
  return { width: 380, height: 266 - top, top }
}
