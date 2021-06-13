<script>
  import { orderBy, times, round } from 'lodash-es';
  import { gatherCombination } from './utils';
  import Token from './Token.svelte';
  import ParachainIcon from './ParachainIcon.svelte';
import MediaQuery from './MediaQuery.svelte';
  export let leases;

  const getBgColorClass = (idx) => {
    switch (idx) {
      case 0:
        return 'bg-red-400';
      case 1:
        return 'bg-yellow-400';
      case 2: 
        return 'bg-blue-400';
      default:
        return 'bg-green-400';
    }
  };

  let combinations;
  $: {
    const sortedLease = orderBy(leases, ['firstLease', 'lastLease'], ['asc', 'asc']);
    const normalizedLeases = sortedLease.map(({ firstLease, lastLease, ...others}) => ({
      slots: times(lastLease - firstLease + 1, (idx) => firstLease + idx),
      firstLease,
      lastLease,
      ...others
    }));
    combinations = orderBy(gatherCombination(normalizedLeases), ['totalLockupValue'], ['desc']);
    // console.log(combinations);
  };

</script>

<div><p class="text-lg mb-1">Bidding Chart</p></div>
<div class="box">
  <MediaQuery query="(max-width: 640px)" let:matches>
    {#if matches}
      <div class="border-t">
        {#each combinations as {series, totalLockupValue, winningChance}, idx}
        <div class="pt-2 px-4 my-2 border-b pb-4"> 
          <div class="flex flex-row justify-between pb-1">
            <div class="rounded-full h-6 w-6 flex items-center justify-center text-white {getBgColorClass(idx)}">{idx + 1} </div>
            <div class="ml-2 text-sm">TLV: <Token value={totalLockupValue} allowZero={true}/></div>
            <div class="text-sm">{round(winningChance * 100, 2)} %</div>
          </div>
          {#each series as lease, leaseIdx}
          <div class="flex py-2">
            <div class="rounded-full py-1 px-2 {leaseIdx % 2 === 0 ? 'color-1' : 'color-2'}">
              Lease {lease.slots.join(' - ')}
            </div>
          </div>
          <div class="flex pl-4 flex-row justify-between">
            <ParachainIcon paraId={lease.paraId} smallIcon={true} align="left" showText={true}/>
            <Token value={lease.latestBidAmount} allowZero={true} />
            <div class="text-sm">{round(lease.leadingRate * 100, 2)} %</div>
          </div>

          {/each}
        </div>
        {/each}
      </div>
    {:else}
      <div class="pt-px">
      {#each combinations as {series, totalLockupValue, winningChance}, idx}
        <div class="grid grid-cols-9 gap-1 border-b border-gray-200 my-1 pt-2 pb-2.5">
          <div class="px-3 absolute-box"> 
            <div class="rounded-full h-8 w-8 flex items-center justify-center text-white {getBgColorClass(idx)}">{idx + 1} </div>
            <div class="leading-rate text-sm">{round(winningChance * 100, 2)} %</div>
            <div class="ml-2 text-sm locked-value">TLV: <Token value={totalLockupValue} allowZero={true}/></div>
          </div>
          {#each series as lease, leaseIdx }
            {#each lease.slots as slot, idx}
            <div class="rounded absolute-box {leaseIdx % 2 === 0 ? 'color-1' : 'color-2'} px-2 py-1">
              <div class="text-bg text-4xl {leaseIdx % 2 === 0 ? 'text-color-1' : 'text-color-2'}">{slot}</div>
              <div class="text-sm">
                <Token value={lease.latestBidAmount} allowZero={true} />
              </div>
              <div class="pt-6">
                <ParachainIcon paraId={lease.paraId} smallIcon={true} align="left" showText={true}/>
              </div>
            </div>
          {/each}
        {/each}
        </div>
      {/each}
      </div>
    {/if}
  </MediaQuery>

</div>

<style>
  .color-1 {
    background-color: rgba(37, 73, 230, 0.10);
  }
  .color-2 {
    background-color: rgba(255, 107, 63, 0.10);
  }
  .text-color-1 {
    color: #2549e6;
  }
  .text-color-2 {
    color: #ff6b3f;
  }
  .absolute-box {
    position: relative;
    min-height: 80px;
  }
  .text-bg {
    position: absolute;
    bottom: 0;
    right: 4px;
    z-index: 10;
    opacity: 0.10;
    overflow: hidden;
  }
  .leading-rate {
    position: absolute;
    top: 1px;
    right: 15px;
    z-index: 10;
    overflow: hidden;
  }
  .locked-value {
    position: absolute;
    bottom: 0;
    right: 15px;
    z-index: 10;
    overflow: hidden;
  }

</style>