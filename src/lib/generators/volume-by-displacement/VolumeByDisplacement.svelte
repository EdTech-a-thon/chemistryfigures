<script lang="ts">
  // Volume by Displacement: pick a graduated cylinder, type the water's
  // reading before and after the object goes in, and get a figure students
  // find the object's volume from.
  import { Circle, Dices, FlaskConical, Ruler, Type } from '@lucide/svelte'
  import FigureTextSettings from '$lib/shared/FigureTextSettings.svelte'
  import GeneratorPage from '$lib/shared/GeneratorPage.svelte'
  import ReadingField from '$lib/shared/ReadingField.svelte'
  import Section from '$lib/shared/Section.svelte'
  import { generatorState } from '$lib/shared/generatorState.svelte'
  import { LIQUID_TINTS, type LiquidTint } from '../volume-reading/liquid'
  import { CYLINDER_SIZES, formatReading, type CylinderSize } from '../volume-reading/scale'
  import DisplacementFigure from './DisplacementFigure.svelte'
  import { MARBLE_COUNTS, OBJECTS, type ObjectKind } from './objects'
  import { displacedVolume, fixReadings, randomReadings } from './readings'
  import { answerLine, cylinderScale, displacementSettings, objectInCylinder } from './settings'

  const gen = generatorState(displacementSettings, 'volume-by-displacement')
  const s = gen.s
  let svg = $state<SVGSVGElement>()

  const TINT_NAMES: Record<LiquidTint, string> = { gray: 'Gray', blue: 'Blue', red: 'Red', green: 'Green' }
  const OBJECT_NAMES: Record<ObjectKind, string> = { marbles: 'Marbles', rock: 'Rock', cube: 'Cube' }
  const scale = $derived(cylinderScale(s.size))
  const shrunk = $derived(objectInCylinder(s).shrunk)
  const objectSummary = $derived(s.object === 'marbles' ? `${s.marbles} marble${s.marbles === 1 ? '' : 's'}` : OBJECT_NAMES[s.object])
  const mL = (v: number) => `${formatReading(scale, v)} mL`

  const readingSummary = $derived(`${mL(s.before)} → ${mL(s.after)}, object ${mL(displacedVolume(scale, s))}`)
  const textSummary = $derived(
    [s.titleMode === 'text' && s.title ? `“${s.title}”` : 'No title', s.answerKey ? 'answer key' : 'no answer key'].join(', '),
  )

  const setReadings = (before: number, after: number) => Object.assign(s, fixReadings(scale, before, after))

  /** A new size keeps both readings at the same fraction of capacity, so
   *  4 → 6 of 10 mL becomes 40 → 60 of 100. */
  function resize(size: CylinderSize) {
    const next = cylinderScale(size)
    const k = next.capacity / scale.capacity
    Object.assign(s, { size, ...fixReadings(next, s.before * k, s.after * k) })
  }
</script>

<GeneratorPage name="Volume by Displacement" filename="volume-by-displacement" {gen} {svg}>
  {#snippet settings()}
    <Section title="Graduated cylinder" summary="{s.size} mL" icon={FlaskConical} open>
      <div class="chips" role="radiogroup" aria-label="Graduated cylinder size">
        {#each CYLINDER_SIZES as size (size)}
          <button type="button" role="radio" aria-checked={s.size === size} class="chip" class:on={s.size === size} onclick={() => resize(size)}>
            {size} mL
          </button>
        {/each}
      </div>
      <p class="field-label">Liquid</p>
      <div class="chips" role="radiogroup" aria-label="Liquid color">
        {#each LIQUID_TINTS as tint (tint)}
          <button type="button" role="radio" aria-checked={s.tint === tint} class="chip" class:on={s.tint === tint} onclick={() => (s.tint = tint)}>
            {TINT_NAMES[tint]}
          </button>
        {/each}
      </div>
    </Section>
    <Section title="Readings" summary={readingSummary} icon={Ruler} open>
      <div class="readings">
        <ReadingField
          label="Before reading"
          value={s.before}
          decimals={scale.decimals}
          min={0}
          max={scale.capacity}
          unit="mL"
          onchange={(v) => setReadings(v, s.after)}
        />
        <ReadingField
          label="After reading"
          value={s.after}
          decimals={scale.decimals}
          min={0}
          max={scale.capacity}
          unit="mL"
          onchange={(v) => setReadings(s.before, v)}
        />
      </div>
      <p class="note">The after reading is always higher; the object’s volume is the difference, {mL(displacedVolume(scale, s))}.</p>
      <button type="button" class="btn-ghost random" onclick={() => Object.assign(s, randomReadings(scale))}>
        <Dices size={17} aria-hidden="true" /> Random readings
      </button>
    </Section>
    <Section title="Object" summary={objectSummary} icon={Circle} open>
      <div class="segmented" role="radiogroup" aria-label="Object">
        {#each OBJECTS as object (object)}
          <button type="button" role="radio" aria-checked={s.object === object} class:on={s.object === object} onclick={() => (s.object = object)}>
            {OBJECT_NAMES[object]}
          </button>
        {/each}
      </div>
      {#if s.object === 'marbles'}
        <p class="field-label">How many</p>
        <div class="chips" role="radiogroup" aria-label="Number of marbles">
          {#each MARBLE_COUNTS as n (n)}
            <button type="button" role="radio" aria-checked={s.marbles === n} class="chip" class:on={s.marbles === n} onclick={() => (s.marbles = n)}>{n}</button>
          {/each}
        </div>
      {/if}
      <p class="note">
        {#if shrunk}
          There’s too little water to cover an object this big, so it’s drawn smaller. Raise the readings to fix this.
        {:else}
          Drawn to look about right for its volume, not to scale.
        {/if}
      </p>
    </Section>
    <Section title="Captions" summary={[s.beforeCaption, s.afterCaption].map((c) => c.trim() || 'none').join(' / ')} icon={Type}>
      <label class="field">
        <span>Under the first cylinder</span>
        <input type="text" bind:value={s.beforeCaption} maxlength="40" placeholder="None" />
      </label>
      <label class="field">
        <span>Under the second cylinder</span>
        <input type="text" bind:value={s.afterCaption} maxlength="40" placeholder="None" />
      </label>
    </Section>
    <Section title="Title and answer key" summary={textSummary} icon={Type}>
      <FigureTextSettings bind:titleMode={s.titleMode} bind:title={s.title} bind:answerKey={s.answerKey} answer={answerLine(s)} />
    </Section>
  {/snippet}
  {#snippet figure()}
    <DisplacementFigure settings={s} bind:svg />
  {/snippet}
</GeneratorPage>

<style>
  .field-label { margin: 0.9rem 0 0.45rem; font-weight: 700; font-size: 0.9rem; }
  .readings { display: flex; flex-direction: column; gap: 0.9rem; }
  .note { margin: 0.7rem 0 0; color: var(--muted); font-size: 0.85rem; }
  .random { margin-top: 0.8rem; padding: 0.5rem 0.8rem; font-size: 0.9rem; }
  .field { display: flex; flex-direction: column; gap: 0.35rem; }
  .field + .field { margin-top: 0.8rem; }
  .field span { font-weight: 700; font-size: 0.9rem; }
</style>
