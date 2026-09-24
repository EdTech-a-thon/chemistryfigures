<script lang="ts">
  // Volume Reading: pick an instrument, type its reading, and get a figure
  // students read the volume from.
  import { FlaskConical, Ruler, Type, ZoomIn } from '@lucide/svelte'
  import FigureTextSettings from '$lib/shared/FigureTextSettings.svelte'
  import GeneratorPage from '$lib/shared/GeneratorPage.svelte'
  import MagnifierSettings from '$lib/shared/MagnifierSettings.svelte'
  import ReadingField from '$lib/shared/ReadingField.svelte'
  import Section from '$lib/shared/Section.svelte'
  import { generatorState } from '$lib/shared/generatorState.svelte'
  import { MAGNIFIER_VIEW_NAMES } from '$lib/shared/magnify'
  import VolumeFigure from './VolumeFigure.svelte'
  import { LIQUID_TINTS, type LiquidTint } from './liquid'
  import { CYLINDER_SIZES, INSTRUMENTS, formatReading, randomReading, roundReading, volumeScale, type CylinderSize, type Instrument } from './scale'
  import { answerLine, volumeSettings } from './settings'

  const gen = generatorState(volumeSettings, 'volume-reading')
  const s = gen.s
  let svg = $state<SVGSVGElement>()

  const INSTRUMENT_NAMES: Record<Instrument, string> = { cylinder: 'Graduated cylinder', buret: 'Buret' }
  const TINT_NAMES: Record<LiquidTint, string> = { gray: 'Gray', blue: 'Blue', red: 'Red', green: 'Green' }
  const scale = $derived(volumeScale(s.instrument, s.size))
  const instrumentName = $derived(s.instrument === 'buret' ? '50 mL buret' : `${s.size} mL graduated cylinder`)

  const textSummary = $derived(
    [s.titleMode === 'text' && s.title ? `“${s.title}”` : 'No title', s.answerKey ? 'answer key' : 'no answer key'].join(', '),
  )

  /** A new instrument or size keeps the reading at the same fraction of
   *  capacity, so 80 of 100 mL becomes 8 of 10. */
  function change(instrument: Instrument, size: CylinderSize) {
    const next = volumeScale(instrument, size)
    s.reading = roundReading(next, (s.reading / scale.capacity) * next.capacity)
    s.instrument = instrument
    s.size = size
  }
</script>

<GeneratorPage
  name="Volume Reading"
  filename="volume-reading"
  {gen}
  {svg}
>
  {#snippet settings()}
    <Section title="Instrument" summary={instrumentName} icon={FlaskConical} open>
      <div class="segmented" role="radiogroup" aria-label="Instrument">
        {#each INSTRUMENTS as instrument (instrument)}
          <button type="button" role="radio" aria-checked={s.instrument === instrument} class:on={s.instrument === instrument} onclick={() => change(instrument, s.size)}>
            {INSTRUMENT_NAMES[instrument]}
          </button>
        {/each}
      </div>
      {#if s.instrument === 'cylinder'}
        <p class="field-label">Size</p>
        <div class="chips" role="radiogroup" aria-label="Graduated cylinder size">
          {#each CYLINDER_SIZES as size (size)}
            <button type="button" role="radio" aria-checked={s.size === size} class="chip" class:on={s.size === size} onclick={() => change('cylinder', size)}>
              {size} mL
            </button>
          {/each}
        </div>
      {:else}
        <p class="note">A buret is always 50 mL, read from 0 at the top.</p>
      {/if}
      <p class="field-label">Liquid</p>
      <div class="chips" role="radiogroup" aria-label="Liquid color">
        {#each LIQUID_TINTS as tint (tint)}
          <button type="button" role="radio" aria-checked={s.tint === tint} class="chip" class:on={s.tint === tint} onclick={() => (s.tint = tint)}>
            {TINT_NAMES[tint]}
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
        onrandom={() => (s.reading = randomReading(scale))}
      />
    </Section>
    <Section title="Magnifier" summary={MAGNIFIER_VIEW_NAMES[s.view]} icon={ZoomIn}>
      <MagnifierSettings bind:view={s.view} bind:span={s.span} />
    </Section>
    <Section title="Title and answer key" summary={textSummary} icon={Type}>
      <FigureTextSettings bind:titleMode={s.titleMode} bind:title={s.title} bind:answerKey={s.answerKey} answer={answerLine(s)} />
    </Section>
  {/snippet}
  {#snippet figure()}
    <VolumeFigure settings={s} bind:svg />
  {/snippet}
</GeneratorPage>

<style>
  .field-label { margin: 0.9rem 0 0.45rem; font-weight: 700; font-size: 0.9rem; }
  .note { margin: 0.7rem 0 0; color: var(--muted); font-size: 0.85rem; }
</style>
