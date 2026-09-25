<script lang="ts">
  // Particle Diagram's figure on its directory card.
  import ParticleFigure from './ParticleFigure.svelte'
  import { boxContents, particleSettings } from './settings'

  const settings = particleSettings.defaults
</script>

<ParticleFigure {settings} box={boxContents(settings)} />
