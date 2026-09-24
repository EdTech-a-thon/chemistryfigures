<script lang="ts">
  // The Volume Reading figure for a set of settings: the instrument, a
  // magnifier around its meniscus, or both side by side.
  import FigureFrame from '$lib/shared/FigureFrame.svelte'
  import Magnifier from '$lib/shared/Magnifier.svelte'
  import { magnifierLayout } from '$lib/shared/magnify'
  import Buret from './Buret.svelte'
  import GraduatedCylinder from './GraduatedCylinder.svelte'
  import { buretLayout } from './buret'
  import { cylinderLayout } from './cylinder'
  import { formatReading, volumeScale } from './scale'
  import { answerLine, type VolumeSettings } from './settings'

  let { settings, svg = $bindable() }: { settings: VolumeSettings; svg?: SVGSVGElement } = $props()

  const scale = $derived(volumeScale(settings.instrument, settings.size))
  const at = $derived(settings.instrument === 'buret' ? buretLayout() : cylinderLayout(scale, settings.size))
  const source = $derived({
    x: at.cx,
    y: at.yOf(settings.reading),
    r: (settings.span * scale.labelEvery * at.perMl) / 2,
  })
  const layout = $derived(magnifierLayout(settings.view, at.width, at.height, source))
  const label = $derived(
    `A ${settings.instrument === 'buret' ? '50 mL buret' : `${settings.size} mL graduated cylinder`} reading ${formatReading(scale, settings.reading)} mL`,
  )
</script>

{#snippet instrument(zoom: number)}
  {#if settings.instrument === 'buret'}
    <Buret {scale} reading={settings.reading} tint={settings.tint} {zoom} />
  {:else}
    <GraduatedCylinder {scale} size={settings.size} reading={settings.reading} tint={settings.tint} {zoom} />
  {/if}
{/snippet}

<FigureFrame
  bind:svg
  width={layout.width}
  height={layout.height}
  {label}
  title={settings.titleMode === 'text' ? settings.title : ''}
  answerKey={settings.answerKey ? answerLine(settings) : ''}
>
  {#if layout.whole}
    <g transform="translate(0 {(layout.height - at.height) / 2})">{@render instrument(1)}</g>
  {/if}
  {#if layout.magnifier}
    <Magnifier {source} target={layout.magnifier} marked={layout.whole} scene={instrument} />
  {/if}
</FigureFrame>
