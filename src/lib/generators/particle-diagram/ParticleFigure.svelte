<script lang="ts">
  // The Particle Diagram figure: the square box with its particles scattered
  // in it, its key to the right, or both, as Show says. `discs` is the
  // scatter for these settings, worked out by whoever shows the figure, since
  // the page also reports what didn't fit.
  import FigureFrame from '$lib/shared/FigureFrame.svelte'
  import Discs from './Discs.svelte'
  import KeyDrawing from './KeyDrawing.svelte'
  import { figureLayout, keyLabel, keyLayout } from './key'
  import { describeLook, kindName, type Disc } from './particles'
  import { BOX_SIDE, DOUBLE_INSET, type ParticleSettings } from './settings'

  let { settings, discs, svg = $bindable() }: { settings: ParticleSettings; discs: Disc[]; svg?: SVGSVGElement } = $props()

  const INSET = DOUBLE_INSET

  const key = $derived(keyLayout(settings.particles, settings.keyNote))
  const layout = $derived(figureLayout(settings.show, key))

  const boxLabel = $derived(
    `A particle diagram: ${settings.particles
      .filter((k) => k.count)
      .map((k) => `${k.count} ${describeLook(k.look)} ${kindName(k).toLowerCase()}${k.count === 1 ? '' : 's'}`)
      .join(', ') || 'an empty box'}`,
  )
  const label = $derived(
    settings.show === 'box'
      ? boxLabel
      : settings.show === 'both'
        ? `${boxLabel}. ${keyLabel(settings.particles, settings.keyNote)}`
        : keyLabel(settings.particles, settings.keyNote, 'A particle diagram key'),
  )
</script>

<FigureFrame bind:svg width={layout.width} height={layout.height} {label} title={settings.titleMode === 'text' ? settings.title : ''}>
  {#if layout.box}
    <g transform="translate({layout.box.x} {layout.box.y})">
      {#if settings.border !== 'none'}
        <rect x="0.75" y="0.75" width={BOX_SIDE - 1.5} height={BOX_SIDE - 1.5} fill="none" stroke="#222" stroke-width="1.5" />
      {/if}
      {#if settings.border === 'double'}
        <rect x={INSET} y={INSET} width={BOX_SIDE - 2 * INSET} height={BOX_SIDE - 2 * INSET} fill="none" stroke="#222" stroke-width="1.5" />
      {/if}
      <Discs {discs} />
    </g>
  {/if}
  {#if layout.key}
    <g transform="translate({layout.key.x} {layout.key.y})">
      <KeyDrawing {key} />
    </g>
  {/if}
</FigureFrame>
