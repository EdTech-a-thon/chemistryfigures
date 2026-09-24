<script lang="ts">
  // The Volume Reading figure for a set of settings.
  import FigureFrame from '$lib/shared/FigureFrame.svelte'
  import GraduatedCylinder from './GraduatedCylinder.svelte'
  import { cylinderLayout } from './cylinder'
  import { formatReading, volumeScale } from './scale'
  import type { VolumeSettings } from './settings'

  let { settings, svg = $bindable() }: { settings: VolumeSettings; svg?: SVGSVGElement } = $props()

  const scale = $derived(volumeScale('cylinder', settings.size))
  const layout = $derived(cylinderLayout(scale, settings.size))
  const label = $derived(`A ${settings.size} mL graduated cylinder reading ${formatReading(scale, settings.reading)} mL`)
</script>

<FigureFrame bind:svg width={layout.width} height={layout.height} {label}>
  <GraduatedCylinder {scale} size={settings.size} reading={settings.reading} tint="gray" />
</FigureFrame>
