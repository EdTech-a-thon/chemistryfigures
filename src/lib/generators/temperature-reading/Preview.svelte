<script lang="ts">
  // Temperature Reading's figure on its directory card.
  import TemperatureFigure from './TemperatureFigure.svelte'
  import { temperatureSettings } from './settings'
</script>

<TemperatureFigure settings={temperatureSettings.defaults} />
