<script lang="ts">
  // Volume Reading's figure on its directory card.
  import VolumeFigure from './VolumeFigure.svelte'
  import { volumeSettings } from './settings'
</script>

<VolumeFigure settings={volumeSettings.defaults} />
