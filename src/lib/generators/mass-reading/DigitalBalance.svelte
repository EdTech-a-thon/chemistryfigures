<script lang="ts">
  // A top-loading digital balance showing a mass on its display, with a weigh
  // boat of powder, a beaker of liquid or nothing on its pan. An analytical
  // balance (3–4 decimal places) stands inside a glass draft shield.
  import { digitalBalanceSize, displayText, type DigitalBalance, type PanContents } from './digital'
  import { segmentTextWidth, sevenSegment } from './sevenSegment'

  let { balance, mass, pan }: { balance: DigitalBalance; mass: number; pan: PanContents } = $props()

  const size = $derived(digitalBalanceSize(balance.analytical, pan))
  // The display always has room for the balance's largest reading, like a
  // real one, with the mass right-aligned against the "g".
  const DIGIT_H = 32
  const DISPLAY_RIGHT = 222
  const text = $derived(displayText(balance, mass))
  const digits = $derived(sevenSegment(text, DISPLAY_RIGHT - segmentTextWidth(text, DIGIT_H), 208, DIGIT_H))
  const cx = 190
</script>

<g transform="translate(0 {-size.top})" stroke-linejoin="round" stroke-linecap="round">
  {#if balance.analytical}
    <!-- draft shield: a glass box with a frame and a sliding door -->
    <rect x="24" y="14" width="332" height="162" fill="#fff" stroke="#111" stroke-width="2" />
    <rect x="24" y="14" width="332" height="10" fill="#fff" stroke="#111" stroke-width="2" />
    <line x1="190" y1="24" x2="190" y2="176" stroke="#111" stroke-width="1.2" />
    <path d="M 48 44 l 22 -14 M 48 60 l 12 -8 M 214 44 l 22 -14 M 214 60 l 12 -8" stroke="#9ca3af" stroke-width="1.5" />
  {/if}

  <!-- body, with a sloped top deck -->
  <path d="M 34 172 H 346 L 370 192 H 10 Z" fill="#fff" stroke="#111" stroke-width="2" />
  <rect x="10" y="192" width="360" height="72" rx="8" fill="#fff" stroke="#111" stroke-width="2" />

  <!-- pan on its post -->
  <rect x={cx - 10} y="160" width="20" height="13" fill="#fff" stroke="#111" stroke-width="2" />
  <rect x={cx - 110} y="151" width="220" height="10" rx="3" fill="#fff" stroke="#111" stroke-width="2" />

  {#if pan === 'boat'}
    <path d="M {cx - 36} 128 Q {cx} 108 {cx + 36} 128 Z" fill="#c4c4c4" stroke="#111" stroke-width="1.5" />
    <path d="M {cx - 58} 128 H {cx + 58} L {cx + 42} 151 H {cx - 42} Z" fill="#fff" stroke="#111" stroke-width="2" />
  {:else if pan === 'beaker'}
    <rect x={cx - 38} y="62" width="76" height="89" fill="#fff" />
    <path d="M {cx - 38} 104 H {cx + 38} V 147 Q {cx + 38} 151 {cx + 34} 151 H {cx - 34} Q {cx - 38} 151 {cx - 38} 147 Z" fill="#dcdcdc" />
    <line x1={cx - 38} y1="104" x2={cx + 38} y2="104" stroke="#444" stroke-width="1.5" />
    {#each [80, 96, 112, 128] as y}
      <line x1={cx + 16} x2={cx + 30} y1={y} y2={y} stroke="#111" stroke-width="1.2" />
    {/each}
    <path d="M {cx - 46} 58 Q {cx - 40} 60 {cx - 38} 66 V 147 Q {cx - 38} 151 {cx - 34} 151 H {cx + 34} Q {cx + 38} 151 {cx + 38} 147 V 60" fill="none" stroke="#111" stroke-width="2" />
  {/if}

  <!-- display -->
  <rect x="28" y="200" width="222" height="48" rx="5" fill="#eef0ec" stroke="#111" stroke-width="2" />
  {#each digits as points}
    <polygon {points} fill="#111" />
  {/each}
  <text x="229" y="239" font-size="16" font-weight="700" fill="#111">g</text>

  <!-- buttons -->
  {#each [['ON/OFF', 268], ['TARE', 316]] as const as [name, x]}
    <rect {x} y="210" width="40" height="24" rx="5" fill="#fff" stroke="#111" stroke-width="1.5" />
    <text x={x + 20} y="226" text-anchor="middle" font-size="8.5" font-weight="700" fill="#111">{name}</text>
  {/each}
</g>
