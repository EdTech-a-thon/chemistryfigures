<script lang="ts">
  // Particle Diagram: list the kinds of atoms and ions, say how many of each,
  // and get a box with them scattered in it.
  import { Atom, Dices, Plus, Square, Trash2, Type } from '@lucide/svelte'
  import GeneratorPage from '$lib/shared/GeneratorPage.svelte'
  import LabelField from '$lib/shared/LabelField.svelte'
  import Section from '$lib/shared/Section.svelte'
  import { generatorState } from '$lib/shared/generatorState.svelte'
  import LookSettings from './LookSettings.svelte'
  import ParticleFigure from './ParticleFigure.svelte'
  import { MAX_COUNT, MAX_KINDS, describeLook, kindName, type ParticleKind } from './particles'
  import { BORDERS, boxParticles, newSeed, particleSettings, type Border } from './settings'

  const gen = generatorState(particleSettings, 'particle-diagram')
  const s = gen.s
  let svg = $state<SVGSVGElement>()

  const BORDER_NAMES: Record<Border, string> = { single: 'Single', double: 'Double', none: 'None' }
  const box = $derived(boxParticles(s))
  const particlesSummary = $derived(s.particles.map((k) => `${k.count} ${describeLook(k.look)}`).join(', '))

  function setCount(kind: ParticleKind, value: number) {
    if (Number.isFinite(value)) kind.count = Math.min(MAX_COUNT, Math.max(0, Math.round(value)))
  }

  function addKind() {
    s.particles.push({ count: 4, look: { size: 'm', shade: 'white', charge: '' } })
  }
</script>

<GeneratorPage name="Particle Diagram" filename="particle-diagram" {gen} {svg}>
  {#snippet settings()}
    <Section title="Particles" summary={particlesSummary} icon={Atom} open>
      {#each s.particles as kind, i (i)}
        {@const name = `${kindName(kind)} ${i + 1}`}
        <div class="kind">
          <div class="kind-head">
            <strong>{name}</strong>
            <label class="count">
              <span>How many</span>
              <input
                type="number"
                min="0"
                max={MAX_COUNT}
                value={kind.count}
                oninput={(e) => setCount(kind, e.currentTarget.valueAsNumber)}
                onchange={(e) => (e.currentTarget.value = String(kind.count))}
              />
            </label>
            {#if s.particles.length > 1}
              <button type="button" class="icon-btn" aria-label="Remove {name}" data-tip="Remove" onclick={() => s.particles.splice(i, 1)}>
                <Trash2 size={17} />
              </button>
            {/if}
          </div>
          <LookSettings bind:look={kind.look} {name} />
        </div>
      {/each}
      <div class="actions">
        {#if s.particles.length < MAX_KINDS}
          <button type="button" class="btn-ghost small" onclick={addKind}><Plus size={17} aria-hidden="true" /> Add a kind</button>
        {/if}
        <button type="button" class="btn-ghost small" onclick={() => (s.seed = newSeed())}><Dices size={17} aria-hidden="true" /> Shuffle</button>
      </div>
      {#if box.missing}
        <p class="warning" role="status">
          {box.missing} particle{box.missing === 1 ? ' doesn’t' : 's don’t'} fit in the box. Try smaller atoms or fewer particles.
        </p>
      {/if}
    </Section>
    <Section title="Box" summary="{BORDER_NAMES[s.border]} border" icon={Square}>
      <p class="field-label">Border</p>
      <div class="segmented" role="radiogroup" aria-label="Border">
        {#each BORDERS as border (border)}
          <button type="button" role="radio" aria-checked={s.border === border} class:on={s.border === border} onclick={() => (s.border = border)}>
            {BORDER_NAMES[border]}
          </button>
        {/each}
      </div>
    </Section>
    <Section title="Chart title" summary={s.titleMode === 'text' && s.title ? `“${s.title}”` : 'No title'} icon={Type}>
      <LabelField name="Chart title" bind:mode={s.titleMode} bind:text={s.title} placeholder="e.g. Which shows NaCl(aq)?" blank={false} />
    </Section>
  {/snippet}
  {#snippet figure()}
    <ParticleFigure settings={s} discs={box.discs} bind:svg />
  {/snippet}
</GeneratorPage>

<style>
  .kind { padding: 0.8rem 0; border-bottom: 1px solid var(--border); }
  .kind:first-child { padding-top: 0.35rem; }
  .kind-head { display: flex; align-items: center; gap: 0.75rem; }
  .kind-head strong { flex: 1; font-size: 0.92rem; }
  .count { display: flex; align-items: center; gap: 0.45rem; font-size: 0.84rem; color: var(--muted); }
  .count input { width: 4.2rem; font-variant-numeric: tabular-nums; }
  .actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.85rem; }
  .small { padding: 0.5rem 0.85rem; font-size: 0.9rem; }
  .warning { margin: 0.75rem 0 0; padding: 0.55rem 0.75rem; border-radius: 10px; background: var(--red-soft); color: #991b1b; font-size: 0.85rem; }
  .field-label { margin: 0 0 0.45rem; font-weight: 700; font-size: 0.9rem; }
</style>
