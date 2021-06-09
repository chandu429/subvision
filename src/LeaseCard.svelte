<script>
  import { range } from 'lodash-es';
  import Token from './Token.svelte';
  import { config } from './constants';
  import ParachainIcon from './ParachainIcon.svelte';
  export let firstLease, lastLease, latestBidAmount, paraId, leadingRate

  $: leases = range(firstLease, lastLease + 1);
  $: blockStart = firstLease * config.leasePeriod;
  $: blockEnd = lastLease * config.leasePeriod;

</script>

<div class="rounded-lg p-2 box">
  <div class="grid grid-cols-5 mb-2">
    <div class="col-span-3 text-base">Lease {leases.join(' - ')}</div>
    <div class="col-span-2 text-gray-400 text-xs text-right">Block: {blockStart} - {blockEnd}</div>
    <!-- <div class="col-span-2 text-right"><button class="border rounded px-6 py-1 bg-white text-sm" style="border: 1px solid {btnColor}">Bid</button></div> -->
  </div>
  <div class="grid grid-cols-3 gap-1 pb-1">
    <div class="text-center text-xm flex flex-col">
      <div class="text-gray-400 mb-2">Current Winner</div>
      {#if paraId}
      <div class="fixed-line-height">
        <ParachainIcon paraId={paraId} smallIcon={true}/>
      </div>
      {:else}
      N/A
      {/if}
    </div>
    <div class="text-center text-xm flex flex-col">
      <div class="text-gray-400 mb-2">Bid Price</div>
      <div class="fixed-line-height">
        <Token class="fixed-line-height" value={latestBidAmount} emptyDisplay='N/A'/>
      </div>
    </div>
    <div class="text-center text-xm flex flex-col">
      <div class="text-gray-400 mb-2">Leading rate</div>
      <div class="fixed-line-height">
        <div class="">{leadingRate ? `${(leadingRate * 100)}%` : 'N/A' }</div>
      </div>
    </div>
  </div>
</div>

<style>
  .fixed-line-height {
    line-height: 24px;
  }
</style>