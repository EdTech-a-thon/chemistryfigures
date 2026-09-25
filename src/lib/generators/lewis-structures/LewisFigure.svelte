<script lang="ts">
  // The Lewis Structures figure: the structure, its resonance structures in a
  // row, or its formula alone, with the chart title above and the answer key
  // under it. With `onselect`, the structure's atoms and bonds can be
  // clicked to pick them for changing.
  import FigureFrame from '$lib/shared/FigureFrame.svelte'
  import StructureDrawing from './StructureDrawing.svelte'
  import { FORMULA_FONT, KEY_FONT, layoutFigure, type Row, type Selection } from './figureLayout'
  import type { Figure, LewisSettings } from './settings'

  interface Props {
    settings: LewisSettings
    figure: Figure
    svg?: SVGSVGElement
    selected?: Selection | null
    onselect?: (selection: Selection) => void
  }
  let { settings, figure, svg = $bindable(), selected = null, onselect }: Props = $props()

  const INK = '#111'
  const layout = $derived(layoutFigure(settings, figure))
  const SCAFFOLD_WORDS = { full: '', bonds: ', with bonds but no lone electrons', skeleton: ', atoms only', formula: '' }

  const label = $derived.by(() => {
    const r = figure.resolved
    if (!r.ok) return 'No Lewis structure'
    if (settings.scaffold === 'formula') return `The formula ${r.name}, to draw its Lewis structure`
    const what = figure.shown.length > 1 ? `The ${figure.shown.length} resonance structures of ${r.name}` : `A Lewis structure of ${r.name}`
    const key =
      figure.key.kind === 'mistakes'
        ? `. Mistakes: ${figure.key.mistakes.join(' ') || 'none'}`
        : figure.key.kind === 'structures'
          ? ', with its full structure as the answer key'
          : ''
    return what + SCAFFOLD_WORDS[settings.scaffold] + key
  })
</script>

{#snippet row(r: Row, pick?: (selection: Selection) => void)}
  {#each r.drawings as d, i (i)}
    <g transform="translate({d.x} {d.y})">
      <StructureDrawing drawing={d.item} {selected} onselect={pick} />
    </g>
  {/each}
  {#each r.arrows as a, i (i)}
    <text x={a.x} y={a.y} dy="0.35em" text-anchor="middle" font-size="26" fill={INK}>⟷</text>
  {/each}
{/snippet}

<FigureFrame bind:svg width={layout.width} height={layout.height} {label} title={settings.titleMode === 'text' ? settings.title : ''}>
  {#if layout.main.kind === 'row'}
    <g transform="translate({layout.main.x} 0)">{@render row(layout.main.row, onselect)}</g>
  {:else if layout.main.kind === 'formula'}
    <text x={layout.main.x} y={layout.main.y} font-size={FORMULA_FONT} fill={INK}>
      {#each layout.main.pieces as p, i (i)}<tspan dy={p.dy} font-size={p.script === 'none' ? FORMULA_FONT : FORMULA_FONT * 0.65}>{p.text}</tspan>{/each}
    </text>
  {:else}
    <text x={layout.width / 2} y={layout.height / 2} dy="0.35em" text-anchor="middle" font-size="16" fill="#666">No structure to draw</text>
  {/if}
  {#if layout.key}
    {@const key = layout.key}
    <text x={key.heading.x} y={key.heading.y} text-anchor={key.lines ? 'start' : 'middle'} font-size={KEY_FONT} font-weight="700" fill={INK}>
      {key.lines ? 'Mistakes' : 'Answer'}
    </text>
    {#if key.row}
      <g transform="translate({key.row.x} {key.row.y})">{@render row(key.row.row)}</g>
    {/if}
    {#each key.lines ?? [] as l, i (i)}
      <text x={l.x} y={l.y} font-size={KEY_FONT} fill={INK} xml:space="preserve">{l.text}</text>
    {/each}
  {/if}
</FigureFrame>
