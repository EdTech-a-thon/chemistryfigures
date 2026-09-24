<script lang="ts">
  // Mass Reading: pick a balance, type a mass, and get a figure students
  // read the mass from.
  import { Scale, Type, Weight, ZoomIn } from '@lucide/svelte'
  import FigureTextSettings from '$lib/shared/FigureTextSettings.svelte'
  import GeneratorPage from '$lib/shared/GeneratorPage.svelte'
  import MagnifierSettings from '$lib/shared/MagnifierSettings.svelte'
  import ReadingField from '$lib/shared/ReadingField.svelte'
  import Section from '$lib/shared/Section.svelte'
  import { generatorState } from '$lib/shared/generatorState.svelte'
  import { MAGNIFIER_VIEW_NAMES } from '$lib/shared/magnify'
  import MassFigure from './MassFigure.svelte'
  import { DECIMAL_PLACES, PAN_CONTENTS, type PanContents } from './digital'
  import { MASS_INSTRUMENTS, answerLine, massRules, massSettings, massText, type MassInstrument } from './settings'

  const gen = generatorState(massSettings, 'mass-reading')
  const s = gen.s
  let svg = $state<SVGSVGElement>()

  const PAN_NAMES: Record<PanContents, string> = { boat: 'Weigh boat', beaker: 'Beaker', empty: 'Nothing' }
  const INSTRUMENT_NAMES: Record<MassInstrument, string> = { digital: 'Digital balance', 'triple-beam': 'Triple beam balance' }
  const rules = $derived(massRules(s))
  const balanceSummary = $derived(
    s.instrument === 'triple-beam' ? 'Triple beam, 610 g' : `Digital, ${s.decimals} decimal place${s.decimals === 1 ? '' : 's'}`,
  )
  const textSummary = $derived(
    [s.titleMode === 'text' && s.title ? `“${s.title}”` : 'No title', s.answerKey ? 'answer key' : 'no answer key'].join(', '),
  )

  /** Another balance keeps the mass, rounded and within what it can weigh. */
  function change(instrument: MassInstrument, decimals: number) {
    s.mass = massRules({ instrument, decimals }).round(s.mass)
    s.instrument = instrument
    s.decimals = decimals
  }
</script>

<GeneratorPage
  name="Mass Reading"
  intro="Type a mass and get a digital or triple beam balance showing it, for students to read."
  filename="mass-reading"
  {gen}
  {svg}
>
  {#snippet settings()}
    <Section title="Balance" summary={balanceSummary} icon={Scale} open>
      <div class="segmented" role="radiogroup" aria-label="Balance">
        {#each MASS_INSTRUMENTS as instrument (instrument)}
          <button type="button" role="radio" aria-checked={s.instrument === instrument} class:on={s.instrument === instrument} onclick={() => change(instrument, s.decimals)}>
            {INSTRUMENT_NAMES[instrument]}
          </button>
        {/each}
      </div>
      {#if s.instrument === 'digital'}
        <p class="field-label">Decimal places</p>
        <div class="chips" role="radiogroup" aria-label="Decimal places">
          {#each DECIMAL_PLACES as d (d)}
            <button type="button" role="radio" aria-checked={s.decimals === d} class="chip" class:on={s.decimals === d} onclick={() => change('digital', d)}>
              {(0).toFixed(d)}
            </button>
          {/each}
        </div>
        <p class="note">3 or 4 places draws an analytical balance inside a draft shield.</p>
        <p class="field-label">On the pan</p>
        <div class="segmented" role="radiogroup" aria-label="On the pan">
          {#each PAN_CONTENTS as pan (pan)}
            <button type="button" role="radio" aria-checked={s.pan === pan} class:on={s.pan === pan} onclick={() => (s.pan = pan)}>
              {PAN_NAMES[pan]}
            </button>
          {/each}
        </div>
      {:else}
        <p class="note">Weighs up to 610 g, read to 0.01 g. The riders are placed for the mass you type.</p>
      {/if}
    </Section>
    <Section title="Mass" summary="{massText(s)} g" icon={Weight} open>
      <ReadingField
        label="Mass"
        value={s.mass}
        decimals={rules.decimals}
        min={0}
        max={rules.capacity}
        unit="g"
        onchange={(v) => (s.mass = rules.round(v))}
        onrandom={() => (s.mass = rules.random())}
      />
    </Section>
    {#if s.instrument === 'triple-beam'}
      <Section title="Magnifier" summary={MAGNIFIER_VIEW_NAMES[s.view]} icon={ZoomIn}>
        <MagnifierSettings bind:view={s.view} bind:span={s.span} />
      </Section>
    {/if}
    <Section title="Title and answer key" summary={textSummary} icon={Type}>
      <FigureTextSettings bind:titleMode={s.titleMode} bind:title={s.title} bind:answerKey={s.answerKey} answer={answerLine(s)} />
    </Section>
  {/snippet}
  {#snippet figure()}
    <MassFigure settings={s} bind:svg />
  {/snippet}
</GeneratorPage>

<style>
  .field-label { margin: 0.9rem 0 0.45rem; font-weight: 700; font-size: 0.9rem; }
  .note { margin: 0.5rem 0 0; color: var(--muted); font-size: 0.82rem; }
</style>
