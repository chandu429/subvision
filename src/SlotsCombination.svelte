<script>
  import { orderBy, times, round } from 'lodash-es';
  import { gatherCombination } from './utils';
  import Token from './Token.svelte';
  import ParachainIcon from './ParachainIcon.svelte';
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

<div class="box">
  <div><p class="p-2 text-lg">Bidding Charts</p></div>
  {#each combinations as {series, totalLockupValue, winningChance}, idx}
  <div class="grid grid-cols-9 gap-1 border-t border-gray-200 my-1 py-2">
    <div class="px-2 absolute-box"> 
      <div class="rounded-full h-6 w-6 flex items-center justify-center text-white {getBgColorClass(idx)}">{idx + 1} </div>
      <div class="leading-rate text-sm">{round(winningChance * 100, 2)} %</div>
      <div class="ml-2 text-sm locked-value">TLV: <Token value={totalLockupValue} allowZero={true}/></div>
    </div>
    {#each series as lease, leaseIdx }

      {#each lease.slots as slot, idx}
      <div class="rounded absolute-box {leaseIdx % 2 === 0 ? 'color-1' : 'color-2'} p-1">
        <div class="text-bg text-4xl {leaseIdx % 2 === 0 ? 'text-color-1' : 'text-color-2'}">{slot}</div>
        <div class="text-xs">
          {#if idx==0}
          <Token value={lease.latestBidAmount} allowZero={true} />
          {/if}
        </div>
        <div class="pt-2">
          {#if idx==0}
          <ParachainIcon paraId={lease.paraId} smallIcon={true} align="left" showText={true}/>
          {/if}
        </div>
      </div>
      {/each}
    {/each}
  </div>
  {/each}

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
    right: 4px;
    z-index: 10;
    overflow: hidden;
  }
  .locked-value {
    position: absolute;
    bottom: 0;
    right: 4px;
    z-index: 10;
    overflow: hidden;
  }
</style>