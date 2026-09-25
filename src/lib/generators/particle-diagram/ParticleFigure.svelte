<script lang="ts">
  // The Particle Diagram figure: the square box with its particles scattered
  // in it. `discs` is the scatter for these settings, worked out by whoever
  // shows the figure, since the page also reports what didn't fit.
  import FigureFrame from '$lib/shared/FigureFrame.svelte'
  import Discs from './Discs.svelte'
  import { describeLook, kindName, type Disc } from './particles'
  import { BOX_SIDE, DOUBLE_INSET, type ParticleSettings } from './settings'

  let { settings, discs, svg = $bindable() }: { settings: ParticleSettings; discs: Disc[]; svg?: SVGSVGElement } = $props()

  const INSET = DOUBLE_INSET

  const label = $derived(
    `A particle diagram: ${settings.particles
      .filter((k) => k.count)
      .map((k) => `${k.count} ${describeLook(k.look)} ${kindName(k).toLowerCase()}${k.count === 1 ? '' : 's'}`)
      .join(', ') || 'an empty box'}`,
  )
</script>

<FigureFrame bind:svg width={BOX_SIDE} height={BOX_SIDE} {label} title={settings.titleMode === 'text' ? settings.title : ''}>
  {#if settings.border !== 'none'}
    <rect x="0.75" y="0.75" width={BOX_SIDE - 1.5} height={BOX_SIDE - 1.5} fill="none" stroke="#222" stroke-width="1.5" />
  {/if}
  {#if settings.border === 'double'}
    <rect x={INSET} y={INSET} width={BOX_SIDE - 2 * INSET} height={BOX_SIDE - 2 * INSET} fill="none" stroke="#222" stroke-width="1.5" />
  {/if}
  <Discs {discs} />
</FigureFrame>
