<script>
  import { range } from 'lodash-es';
  import Token from './Token.svelte';
  import { config } from './constants';
  export let firstSlot, lastSlot, leaseStart = '', leaseEnd = '', paraId, amount, wonBlocks, groupIdx

  const colorConfigs = [
    { bgColor: '#f5f6ff', borderColor: '#ced8ff', btnColor: '#9e89f0' },
    { borderColor: '#d0ebff', bgColor: '#f3faff', btnColor: '#5dbdf5' },
    { bgColor: '#fffcf0', borderColor: '#fcf4ba', btnColor: '#f3df2a' },
    { borderColor: '#d3eaea', bgColor: '#f3fbfd', btnColor: '#91dadb' }
  ];

  const { bgColor, borderColor, btnColor } = colorConfigs[groupIdx] || {};

  $: slots = range(firstSlot, lastSlot + 1);
  $: blockStart = firstSlot * config.leasePeriod;
  $: blockEnd = lastSlot * config.leasePeriod;
</script>

<div class="rounded-lg p-2 col-span-6 zoom-in" style="background-color: {bgColor}; border: 1px solid {borderColor}">
  <div class="grid grid-cols-5 mb-2">
    <div class="col-span-3 text-base">Slot {slots.join(' - ')}</div>
    <div class="col-span-2 text-gray-400 text-xs text-right">Block: {leaseStart || blockStart} - {leaseEnd || blockEnd}</div>
    <!-- <div class="col-span-2 text-right"><button class="border rounded px-6 py-1 bg-white text-sm" style="border: 1px solid {btnColor}">Bid</button></div> -->
  </div>
  <div class="grid grid-cols-3 gap-1">
    <div class="text-center text-xm flex flex-col">
      <div class="text-gray-400 mb-2">Current Winner</div>
      <div class="flex flex-row justify-center items-center">
        {#if paraId}
        <img class="mx-1 rounded-full" src="./ksm-logo.png" alt="{paraId}" width="22" height="22">
        {/if}
        <div class="mx-1">{paraId || 'N/A'}</div>
      </div>
    </div>
    <div class="text-center text-xm flex flex-col">
      <div class="text-gray-400 mb-2">Bid Price</div>
      <div class="flex flex-row justify-center items-center fixed-line-height">
        <Token class="fixed-line-height" value={amount} emptyDisplay='N/A'/>
      </div>
    </div>
    <div class="text-center text-xm flex flex-col">
      <div class="text-gray-400 mb-2">Winning Chance</div>
      <div class="flex flex-row justify-center items-center">
        <div class="fixed-line-height">{wonBlocks || 'N/A' }</div>
      </div>
    </div>
    <!-- <div class="text-center text-sm"><p>Winning Chance:</p><p>{winningChance || 'N/A'}</p></div> -->
  </div>
</div>

<style>
  .fixed-line-height {
    line-height: 24px;
  }
</style>