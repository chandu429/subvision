<script>
  import { orderBy, times, round } from 'lodash-es';
  import { gatherCombination } from './utils';
  import Token from './Token.svelte';
  import ParachainIcon from './ParachainIcon.svelte';
  import MediaQuery from './MediaQuery.svelte';
  import { Link } from 'svelte-navigator';
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
  };

</script>

<div>
  <p class="text-lg mb-1">Bidding Chart</p>
</div>
<div class="">
  <MediaQuery query="(max-width: 600px)" let:matches>
    {#if matches}
      {#if combinations.length}
        <div>
          {#each combinations as {series, totalLockupValue, winningChance}, idx}
          <div class="pt-3 px-4 my-4 border-b pb-2 box"> 
            <div class="flex flex-row justify-between pb-2 border-b">
              <div class="rounded-full h-6 w-6 flex items-center justify-center text-white {getBgColorClass(idx)}">{idx + 1} </div>
              <div class="ml-2 text-right"><Token value={totalLockupValue} allowZero={true}/></div>
              <div class="text-right text-gray-400">{round(winningChance * 100, 2)} %</div>
            </div>
            {#each series as lease, leaseIdx}
            <div class="my-2">
              <div class="flex">
                <div class="rounded-full py-1 px-2 {leaseIdx % 2 === 0 ? 'color-1' : 'color-2'}">
                  Lease {lease.slots.join(' - ')}
                </div>
              </div>
              <div class="flex flex-row justify-between items-center mt-2">
                <ParachainIcon paraId={lease.paraId} smallIcon={true} align="left" showText={true}/>
                <div class="text-right">
                  <div class="text-xs text-gray-400">Amount</div>
                  <Token value={lease.latestBidAmount} allowZero={true} />
                </div>
                <div class="text-right">
                  <div class="text-xs text-gray-400">Leading Rate</div>
                  <div class="">{round(lease.leadingRate * 100, 2)} %</div>
                </div>
              </div>
            </div>
            {/each}
          </div>
          {/each}
        </div>
      {:else}
        <div class="box mt-2 p-6 text-center">
          No bids submitted yet, Checkout <Link to="/crowdloan" class="text-blue-600 underline">Crowdloans</Link>
        </div>
      {/if}
    {:else}
      <div class="pt-px box">
      {#each combinations as {series, totalLockupValue, winningChance}, idx}
        <div class="grid grid-cols-9 gap-1.5 border-b border-gray-200 my-1 pt-2 pb-2.5">
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