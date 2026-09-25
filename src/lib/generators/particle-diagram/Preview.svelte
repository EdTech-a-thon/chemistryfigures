<script lang="ts">
  // Particle Diagram's figure on its directory card.
  import ParticleFigure from './ParticleFigure.svelte'
  import { boxParticles, particleSettings } from './settings'

  const settings = particleSettings.defaults
</script>

<ParticleFigure {settings} discs={boxParticles(settings).discs} />
