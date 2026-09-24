<script lang="ts">
  // Volume Reading: pick an instrument, type its reading, and get a figure
  // students read the volume from.
  import { FlaskConical, Ruler, ZoomIn } from '@lucide/svelte'
  import GeneratorPage from '$lib/shared/GeneratorPage.svelte'
  import MagnifierSettings from '$lib/shared/MagnifierSettings.svelte'
  import ReadingField from '$lib/shared/ReadingField.svelte'
  import Section from '$lib/shared/Section.svelte'
  import { generatorState } from '$lib/shared/generatorState.svelte'
  import { MAGNIFIER_VIEW_NAMES } from '$lib/shared/magnify'
  import VolumeFigure from './VolumeFigure.svelte'
  import { CYLINDER_SIZES, formatReading, roundReading, volumeScale, type CylinderSize } from './scale'
  import { volumeSettings } from './settings'

  const gen = generatorState(volumeSettings, 'volume-reading')
  const s = gen.s
  let svg = $state<SVGSVGElement>()

  const scale = $derived(volumeScale('cylinder', s.size))

  /** A new size keeps the liquid at the same height, so 80 of 100 mL becomes 8 of 10. */
  function setSize(size: CylinderSize) {
    const next = volumeScale('cylinder', size)
    s.reading = roundReading(next, (s.reading / scale.capacity) * next.capacity)
    s.size = size
  }
</script>

<GeneratorPage
  name="Volume Reading"
  intro="Type a reading and get a graduated cylinder showing it, for students to read."
  filename="volume-reading"
  {gen}
  {svg}
>
  {#snippet settings()}
    <Section title="Instrument" summary="{s.size} mL graduated cylinder" icon={FlaskConical} open>
      <p class="field-label">Graduated cylinder size</p>
      <div class="chips" role="radiogroup" aria-label="Graduated cylinder size">
        {#each CYLINDER_SIZES as size (size)}
          <button type="button" role="radio" aria-checked={s.size === size} class="chip" class:on={s.size === size} onclick={() => setSize(size)}>
            {size} mL
          </button>
        {/each}
      </div>
    </Section>
    <Section title="Reading" summary="{formatReading(scale, s.reading)} mL" icon={Ruler} open>
      <ReadingField
        label="Reading"
        value={s.reading}
        decimals={scale.decimals}
        min={0}
        max={scale.capacity}
        unit="mL"
        onchange={(v) => (s.reading = roundReading(scale, v))}
      />
    </Section>
    <Section title="Magnifier" summary={MAGNIFIER_VIEW_NAMES[s.view]} icon={ZoomIn}>
      <MagnifierSettings bind:view={s.view} bind:span={s.span} />
    </Section>
  {/snippet}
  {#snippet figure()}
    <VolumeFigure settings={s} bind:svg />
  {/snippet}
</GeneratorPage>

<style>
  .field-label { margin: 0 0 0.45rem; font-weight: 700; font-size: 0.9rem; }
</style>
