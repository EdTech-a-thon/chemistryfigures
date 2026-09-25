<script lang="ts">
  // The Volume by Displacement figure for a set of settings: the same
  // graduated cylinder twice, side by side, before and after the object goes
  // in, each with its caption underneath.
  import FigureFrame from '$lib/shared/FigureFrame.svelte'
  import GraduatedCylinder from '../volume-reading/GraduatedCylinder.svelte'
  import { cylinderLayout } from '../volume-reading/cylinder'
  import { formatReading } from '../volume-reading/scale'
  import { answerLine, cylinderScale, type DisplacementSettings } from './settings'

  let { settings, svg = $bindable() }: { settings: DisplacementSettings; svg?: SVGSVGElement } = $props()

  const GAP = 64
  const CAPTION_H = 34

  const scale = $derived(cylinderScale(settings.size))
  const at = $derived(cylinderLayout(scale, settings.size))
  const captioned = $derived(!!(settings.beforeCaption.trim() || settings.afterCaption.trim()))
  const width = $derived(2 * at.width + GAP)
  const height = $derived(at.height + (captioned ? CAPTION_H : 0))
  const marble = $derived((at.tubeW * 0.8) / 2)
  const label = $derived(
    `A ${settings.size} mL graduated cylinder reading ${formatReading(scale, settings.before)} mL, ` +
      `then ${formatReading(scale, settings.after)} mL with an object in it`,
  )
</script>

{#snippet cylinder(x: number, reading: number, caption: string, object: boolean)}
  <g transform="translate({x} 0)">
    <GraduatedCylinder {scale} size={settings.size} {reading} tint={settings.tint}>
      {#if object}
        <circle cx={at.cx} cy={at.innerBottom - marble} r={marble} fill="#9a9a9a" stroke="#111" stroke-width="1.6" />
      {/if}
    </GraduatedCylinder>
    {#if caption.trim()}
      <text x={at.cx} y={at.height + 24} text-anchor="middle" font-size="18" font-weight="700" fill="#111">{caption.trim()}</text>
    {/if}
  </g>
{/snippet}

<FigureFrame
  bind:svg
  {width}
  {height}
  {label}
  title={settings.titleMode === 'text' ? settings.title : ''}
  answerKey={settings.answerKey ? answerLine(settings) : ''}
>
  {@render cylinder(0, settings.before, settings.beforeCaption, false)}
  {@render cylinder(at.width + GAP, settings.after, settings.afterCaption, true)}
</FigureFrame>
