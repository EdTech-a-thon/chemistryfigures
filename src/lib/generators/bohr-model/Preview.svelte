<script lang="ts">
  // Bohr Model's figures on its directory card: carbon with a ball nucleus,
  // and sodium with its counts written in the nucleus.
  import SplitPreview from '$lib/shared/SplitPreview.svelte'
  import BohrFigure from './BohrFigure.svelte'
  import { bohrSettings } from './settings'

  const carbon = bohrSettings.defaults
  const sodium = bohrSettings.tidy({ ...carbon, protons: 11, neutrons: 12, nucleus: 'text', electrons: [2, 8, 1] })
</script>

{#snippet carbonFigure()}<BohrFigure settings={carbon} />{/snippet}
{#snippet sodiumFigure()}<BohrFigure settings={sodium} />{/snippet}

<SplitPreview figures={[carbonFigure, sodiumFigure]} />
