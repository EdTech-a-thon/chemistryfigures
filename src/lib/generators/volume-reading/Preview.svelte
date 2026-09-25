<script lang="ts">
  // Volume Reading's figures on its directory card: the graduated cylinder,
  // the buret and the beaker.
  import SplitPreview from '$lib/shared/SplitPreview.svelte'
  import VolumeFigure from './VolumeFigure.svelte'
  import { volumeSettings } from './settings'

  const buret = volumeSettings.tidy({ ...volumeSettings.defaults, instrument: 'buret' })
  const beaker = volumeSettings.tidy({ ...volumeSettings.defaults, instrument: 'beaker' })
</script>

{#snippet cylinderFigure()}<VolumeFigure settings={volumeSettings.defaults} />{/snippet}
{#snippet buretFigure()}<VolumeFigure settings={buret} />{/snippet}
{#snippet beakerFigure()}<VolumeFigure settings={beaker} />{/snippet}

<SplitPreview split="vertical" figures={[cylinderFigure, buretFigure, beakerFigure]} />
