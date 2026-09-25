<script lang="ts">
  // Orbital Diagram's figures on its directory card: oxygen, and iron with
  // its noble gas core.
  import SplitPreview from '$lib/shared/SplitPreview.svelte'
  import OrbitalFigure from './OrbitalFigure.svelte'
  import { orbitalSettings } from './settings'

  const oxygen = orbitalSettings.defaults
  const iron = orbitalSettings.tidy({ ...oxygen, z: 26, core: true })
</script>

{#snippet oxygenFigure()}<OrbitalFigure settings={oxygen} />{/snippet}
{#snippet ironFigure()}<OrbitalFigure settings={iron} />{/snippet}

<SplitPreview figures={[oxygenFigure, ironFigure]} />
