<script lang="ts">
  // The Mass Reading figure for a set of settings.
  import FigureFrame from '$lib/shared/FigureFrame.svelte'
  import DigitalBalance from './DigitalBalance.svelte'
  import { digitalBalanceSize, displayText } from './digital'
  import { answerLine, balanceOf, type MassSettings } from './settings'

  let { settings, svg = $bindable() }: { settings: MassSettings; svg?: SVGSVGElement } = $props()

  const balance = $derived(balanceOf(settings))
  const size = $derived(digitalBalanceSize(balance.analytical, settings.pan))
  const label = $derived(`A digital balance showing ${displayText(balance, settings.mass)} g`)
</script>

<FigureFrame
  bind:svg
  width={size.width}
  height={size.height}
  {label}
  title={settings.titleMode === 'text' ? settings.title : ''}
  answerKey={settings.answerKey ? answerLine(settings) : ''}
>
  <DigitalBalance {balance} mass={settings.mass} pan={settings.pan} />
</FigureFrame>
