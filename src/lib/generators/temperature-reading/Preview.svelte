<script lang="ts">
  // Temperature Reading's figures on its directory card: the liquid-in-glass
  // thermometer and the digital one.
  import SplitPreview from '$lib/shared/SplitPreview.svelte'
  import TemperatureFigure from './TemperatureFigure.svelte'
  import { temperatureSettings } from './settings'

  const digital = temperatureSettings.tidy({ ...temperatureSettings.defaults, instrument: 'digital' })
</script>

{#snippet glassFigure()}<TemperatureFigure settings={temperatureSettings.defaults} />{/snippet}
{#snippet digitalFigure()}<TemperatureFigure settings={digital} />{/snippet}

<SplitPreview split="vertical" figures={[glassFigure, digitalFigure]} />
