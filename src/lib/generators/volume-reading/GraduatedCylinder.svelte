<script lang="ts">
  // A graduated cylinder holding liquid up to the reading, drawn at `zoom`
  // (1 for the whole instrument; more inside a magnifier, where finer marks
  // appear and lines and numbers stay a comfortable size).
  import { legibleMarks, marks } from '$lib/shared/marks'
  import { sizeAt } from '$lib/shared/magnify'
  import { cylinderLayout } from './cylinder'
  import { LIQUID_COLORS, meniscusCurve, type LiquidTint } from './liquid'
  import type { CylinderSize, Scale } from './scale'

  interface Props {
    scale: Scale
    size: CylinderSize
    reading: number
    tint: LiquidTint
    zoom?: number
  }
  let { scale, size, reading, tint, zoom = 1 }: Props = $props()

  const at = $derived(cylinderLayout(scale, size))
  const k = $derived(sizeAt(zoom))
  const font = $derived(11 * k)
  const liquid = $derived(LIQUID_COLORS[tint])
  // A cylinder isn't marked at 0.
  const shown = $derived(
    legibleMarks(marks({ ...scale, max: scale.capacity }), scale.minorEvery * at.perMl * zoom, 16).filter((m) => m.value > 0),
  )
  const tick = $derived({ major: at.tubeW * 0.5, medium: at.tubeW * 0.36, minor: at.tubeW * 0.24 })

  const surface = $derived(meniscusCurve(at.left, at.right, at.yOf(reading), at.meniscus))
  const r = 7 // inside corner radius at the bottom
  const tube = $derived(
    `M ${at.left} ${at.tubeTop} V ${at.innerBottom - r} Q ${at.left} ${at.innerBottom} ${at.left + r} ${at.innerBottom} ` +
      `H ${at.right - r} Q ${at.right} ${at.innerBottom} ${at.right} ${at.innerBottom - r} V ${at.tubeTop}`,
  )
</script>

<g stroke-linecap="round" stroke-linejoin="round">
  <!-- the foot, and the solid glass between it and the inside of the tube -->
  <path
    d="M {at.cx - at.footW / 2 + 6} {at.footTop} H {at.cx + at.footW / 2 - 6} L {at.cx + at.footW / 2} {at.footTop + 14} H {at.cx - at.footW / 2} Z"
    fill="#fff"
    stroke="#111"
    stroke-width={2 * k}
  />
  <path d="M {at.left} {at.innerBottom - r} V {at.footTop} M {at.right} {at.innerBottom - r} V {at.footTop}" stroke="#111" stroke-width={2 * k} />

  {#if reading > 0}
    <path
      d="{surface} V {at.innerBottom - r} Q {at.right} {at.innerBottom} {at.right - r} {at.innerBottom} H {at.left + r} Q {at.left} {at.innerBottom} {at.left} {at.innerBottom - r} Z"
      fill={liquid.fill}
    />
  {/if}

  {#each shown as m (m.value)}
    {@const y = at.yOf(m.value)}
    <line x1={at.left} x2={at.left + tick[m.kind]} y1={y} y2={y} stroke="#111" stroke-width={(m.kind === 'major' ? 1.5 : 1) * k} />
    {#if m.label}
      <text x={at.left + tick.major + 3 * k} {y} dy="0.35em" font-size={font} fill="#111">{m.label}</text>
    {/if}
  {/each}
  <text x={at.cx} y={at.yOf(scale.capacity) - 22} text-anchor="middle" font-size={font} fill="#111">mL</text>

  {#if reading > 0}
    <path d={surface} fill="none" stroke={liquid.surface} stroke-width={1.6 * k} />
  {/if}

  <path d={tube} fill="none" stroke="#111" stroke-width={2 * k} />
  <!-- the rim, with its pouring lip on the left -->
  <path
    d="M {at.left - 6} {at.rimTop + 2} Q {at.left - 2} {at.tubeTop} {at.left} {at.tubeTop + 4} M {at.left - 6} {at.rimTop + 2} H {at.right + 3} V {at.tubeTop} H {at.right}"
    fill="none"
    stroke="#111"
    stroke-width={2 * k}
  />
</g>
