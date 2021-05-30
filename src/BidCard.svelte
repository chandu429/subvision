
<script>
  import { now } from 'svelte/internal';
  import ParachainIcon from './ParachainIcon.svelte';
  import Token from './Token.svelte';
  import { getTimeDiffInWord } from './utils';
  export let bidder, firstSlot, lastSlot, createdAt, amount, parachain, isCrowdloan;
  const { paraId } = parachain || {};
</script>

<div class="box mb-3 px-5 py-3 grid grid-cols-5 grid-flow-row gap-2">
  <div class="col-span-1">
    <ParachainIcon paraId={paraId} smallIcon />
  </div>
  <div class="text-xs text-gray-500 col-span-4 text-right">{getTimeDiffInWord(Date.now() - new Date(createdAt).getTime())}</div>
  <div class="text-base col-span-5">
    has submit a new bid for slot {firstSlot} - {lastSlot} at <Token value={amount} />
  </div>
  <div class="text-xs col-span-5 flex">
    {#if isCrowdloan }
      <div class="text-gray-600">From Crowdloan {paraId}</div>
    {:else}
      <div class="text-gray-600 ellipsis-text"><span alt="{bidder}">From bidder {bidder}</span></div>
    {/if}
  </div>
</div>


<style>
  .ellipsis-text {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>