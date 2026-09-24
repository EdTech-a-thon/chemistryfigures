<script lang="ts">
  // Mass Reading: pick a balance, type a mass, and get a figure students
  // read the mass from.
  import { Scale, Type, Weight } from '@lucide/svelte'
  import FigureTextSettings from '$lib/shared/FigureTextSettings.svelte'
  import GeneratorPage from '$lib/shared/GeneratorPage.svelte'
  import ReadingField from '$lib/shared/ReadingField.svelte'
  import Section from '$lib/shared/Section.svelte'
  import { generatorState } from '$lib/shared/generatorState.svelte'
  import MassFigure from './MassFigure.svelte'
  import { DECIMAL_PLACES, PAN_CONTENTS, digitalBalance, displayText, randomMass, roundMass, type PanContents } from './digital'
  import { answerLine, balanceOf, massSettings } from './settings'

  const gen = generatorState(massSettings, 'mass-reading')
  const s = gen.s
  let svg = $state<SVGSVGElement>()

  const PAN_NAMES: Record<PanContents, string> = { boat: 'Weigh boat', beaker: 'Beaker', empty: 'Nothing' }
  const balance = $derived(balanceOf(s))
  const textSummary = $derived(
    [s.titleMode === 'text' && s.title ? `“${s.title}”` : 'No title', s.answerKey ? 'answer key' : 'no answer key'].join(', '),
  )

  function setDecimals(decimals: (typeof DECIMAL_PLACES)[number]) {
    s.mass = roundMass(digitalBalance(decimals), s.mass)
    s.decimals = decimals
  }
</script>

<GeneratorPage
  name="Mass Reading"
  intro="Type a mass and get a balance showing it, for students to read."
  filename="mass-reading"
  {gen}
  {svg}
>
  {#snippet settings()}
    <Section title="Balance" summary="Digital, {s.decimals} decimal place{s.decimals === 1 ? '' : 's'}" icon={Scale} open>
      <p class="field-label first">Decimal places</p>
      <div class="chips" role="radiogroup" aria-label="Decimal places">
        {#each DECIMAL_PLACES as d (d)}
          <button type="button" role="radio" aria-checked={s.decimals === d} class="chip" class:on={s.decimals === d} onclick={() => setDecimals(d)}>
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
    </Section>
    <Section title="Mass" summary="{displayText(balance, s.mass)} g" icon={Weight} open>
      <ReadingField
        label="Mass"
        value={s.mass}
        decimals={balance.decimals}
        min={0}
        max={balance.capacity}
        unit="g"
        onchange={(v) => (s.mass = roundMass(balance, v))}
        onrandom={() => (s.mass = randomMass(balance))}
      />
    </Section>
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
  .field-label.first { margin-top: 0; }
  .note { margin: 0.5rem 0 0; color: var(--muted); font-size: 0.82rem; }
</style>
