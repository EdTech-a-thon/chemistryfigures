<script lang="ts" module>
  // Where things sit on the drawing, shared with the figure's layout so the
  // magnifier can find the front beam's rider.
  export const TRIPLE_BEAM = {
    width: 668,
    height: 292,
    beamStart: 236,
    beamLength: 360,
    /** the marks are inset from the beams' ends */
    markStart: 248,
    markLength: 336,
    /** top of each beam, rear (0–500 g) to front (0–10 g) */
    beamTops: [122, 170, 218],
    beamH: 24,
    /** drawing units per gram on the front beam */
    frontPerGram: 33.6,
  }
  export const frontRiderX = (front: number) => TRIPLE_BEAM.markStart + front * TRIPLE_BEAM.frontPerGram
  /** the front rider's point, where the magnifier centers */
  export const frontBeamY = TRIPLE_BEAM.beamTops[2] + 4
</script>

<script lang="ts">
  // A triple beam balance with its riders placed for a mass, drawn at `zoom`
  // (1 for the whole balance; more inside a magnifier on the front beam).
  import { legibleMarks, marks } from '$lib/shared/marks'
  import { sizeAt } from '$lib/shared/magnify'
  import { splitRiders } from './tripleBeam'

  let { mass, zoom = 1 }: { mass: number; zoom?: number } = $props()

  const B = TRIPLE_BEAM
  const k = $derived(sizeAt(zoom))
  const riders = $derived(splitRiders(mass))
  const x0 = B.beamStart
  const x1 = B.beamStart + B.beamLength
  const [rearTop, middleTop, frontTop] = B.beamTops

  const notched = [
    { top: rearTop, max: 500, step: 100 },
    { top: middleTop, max: 100, step: 10 },
  ]
  const xOn = (value: number, max: number) => B.markStart + (value / max) * B.markLength
  const front = $derived(
    legibleMarks(marks({ max: 10, labelEvery: 1, minorEvery: 0.1 }), 0.1 * B.frontPerGram * zoom, 14),
  )
  const tick = { major: 10, medium: 7, minor: 4.5 }
  const pointerY = middleTop + B.beamH / 2
</script>

{#snippet rider(x: number, top: number)}
  <!-- sits on the beam, its point marking the reading -->
  <path
    d="M {x - 10} {top - 19} H {x + 10} V {top - 7} L {x} {top} L {x - 10} {top - 7} Z"
    fill="#d4d4d4"
    stroke="#111"
    stroke-width={1.5 * k}
  />
{/snippet}

<g stroke-linejoin="round" stroke-linecap="round">
  <!-- base, and the column holding up the pan -->
  <rect x="8" y="254" width="652" height="34" rx="10" fill="#fff" stroke="#111" stroke-width={2 * k} />
  <rect x="88" y="158" width="20" height="96" fill="#fff" stroke="#111" stroke-width={2 * k} />
  <path d="M 18 142 H 178 L 168 154 Q 98 162 28 154 Z" fill="#fff" stroke="#111" stroke-width={2 * k} />

  <!-- the arm from the pan to the block holding the beams, which rests on a knife-edge pivot -->
  <rect x="108" y="164" width={x0 - 126} height="9" fill="#fff" stroke="#111" stroke-width={2 * k} />
  <rect x={x0 - 18} y={rearTop - 4} width="18" height={frontTop + B.beamH - rearTop + 8} fill="#fff" stroke="#111" stroke-width={2 * k} />
  <path d="M {x0 - 9} {frontTop + B.beamH + 4} L {x0 + 1} 254 H {x0 - 19} Z" fill="#fff" stroke="#111" stroke-width={2 * k} />

  <!-- the two notched beams -->
  {#each notched as beam (beam.max)}
    <rect x={x0} y={beam.top} width={B.beamLength} height={B.beamH} fill="#fff" stroke="#111" stroke-width={2 * k} />
    {#each Array.from({ length: beam.max / beam.step + 1 }, (_, i) => i * beam.step) as v (v)}
      {@const x = xOn(v, beam.max)}
      <path d="M {x - 4} {beam.top} L {x} {beam.top + 5} L {x + 4} {beam.top}" fill="none" stroke="#111" stroke-width={1.3 * k} />
      <text {x} y={beam.top + B.beamH - 5} text-anchor="middle" font-size={10 * k} fill="#111">{v}</text>
    {/each}
  {/each}

  <!-- the front beam, marked every 0.1 g -->
  <rect x={x0} y={frontTop} width={B.beamLength} height={B.beamH} fill="#fff" stroke="#111" stroke-width={2 * k} />
  {#each front as m (m.value)}
    {@const x = xOn(m.value, 10)}
    <line x1={x} x2={x} y1={frontTop} y2={frontTop + tick[m.kind] * Math.min(1, 1.6 * k)} stroke="#111" stroke-width={(m.kind === 'major' ? 1.4 : 1) * k} />
    {#if m.label}
      <text {x} y={frontTop + B.beamH - 3 * k} text-anchor="middle" font-size={9 * k} fill="#111">{m.label}</text>
    {/if}
  {/each}

  <!-- pointer at zero on its scale -->
  <path d="M {x1} {rearTop} H {x1 + 22} L {x1 + 44} {pointerY} L {x1 + 22} {frontTop + B.beamH} H {x1}" fill="none" stroke="#111" stroke-width={2 * k} />
  <rect x={x1 + 48} y={pointerY - 30} width="16" height="60" fill="#fff" stroke="#111" stroke-width={1.6 * k} />
  {#each [-20, -10, 0, 10, 20] as dy}
    <line x1={x1 + 48} x2={x1 + (dy === 0 ? 62 : 56)} y1={pointerY + dy} y2={pointerY + dy} stroke="#111" stroke-width={(dy === 0 ? 1.6 : 1) * k} />
  {/each}
  <line x1={x1 + 30} x2={x1 + 50} y1={pointerY} y2={pointerY} stroke="#111" stroke-width={2 * k} />

  <!-- riders -->
  {@render rider(xOn(riders.hundreds, 500), rearTop)}
  {@render rider(xOn(riders.tens, 100), middleTop)}
  {@render rider(xOn(riders.front, 10), frontTop)}
</g>
