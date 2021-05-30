<script>
  import { range, minBy, maxBy } from 'lodash-es';
  import { config } from './constants';
  import ParachainIcon from './ParachainIcon.svelte';
  import ProgressBar from './ProgressBar.svelte';
  import { lastBlockNum, lastBlockTime } from './stores';
  import { getDateFromBlockNum, getColSpan } from './utils';

  export let leases;
  const { leasePeriod, leasesPerSlot } = config;

  let activeLeases, slotIdxs, allSlots;

  $: {
    activeLeases = leases
    .filter(({ lastLease }) => lastLease * leasePeriod > $lastBlockNum)
    .map(({firstLease, lastLease, ...rest}) => ({ slots: range(firstLease, lastLease + 1), firstLease, lastLease, ...rest }));
    
    const defaultSlotStart = Math.ceil($lastBlockNum / leasePeriod);
    const defaultSlotEnd = defaultSlotStart + leasesPerSlot;

    const leaseSlotStart = minBy(activeLeases, "firstLease")?.firstLease;
    const leaseSlotEnd = maxBy(leases, "lastLease")?.lastLease;
    
    const slotStart = Math.min(leaseSlotStart || defaultSlotStart, defaultSlotStart);
    const slotEnd = Math.max(leaseSlotEnd || defaultSlotEnd, defaultSlotEnd);
    
    slotIdxs = range(slotStart, slotEnd+1);
    allSlots = slotIdxs.map((slotIdx) => ({ idx: slotIdx, startBlock: slotIdx * leasePeriod, endBlock: (slotIdx + 1) * leasePeriod  }));

  }
</script>

<div class="box overflow-x-scroll py-2">
  <table class="w-full text-center">
    <tr>
      {#if activeLeases.length}
      <th class="parachain-head"></th>
      {/if}
      {#each allSlots as slot}
      <td>
        <div class="slot-head">
          <p class="text-lg">Lease {slot.idx}</p>
          <p class="text-gray-400 text-xs">{slot.startBlock} - {slot.endBlock}</p>
          <div class="slot-time text-gray-400 text-xs">{getDateFromBlockNum(slot.endBlock, $lastBlockNum, $lastBlockTime)}
          </div>
        </div>
      </td>
      {/each}
    </tr>
    {#if !activeLeases.length} 
    <tr>
      <td colspan={allSlots.length + 1}>
        <div class="flex empty-content justify-center items-center">
          <div>No parachain leased yet</div>
        </div>
      </td>
    </tr>
    {:else}
      {#each activeLeases as lease, idx (lease.id)}
      <tr class="{idx % 2 > 0 ? 'bg-gray-100':''}">
        <td class="py-3">
          <ParachainIcon paraId={lease.parachain.paraId} smallIcon/>
        </td>
        {#each getColSpan(slotIdxs, lease.slots) as span}
        <td colspan="{span}" >
          {#if span > 0}
            <ProgressBar />
          {/if}
        </td>
        {/each}
      </tr>
      {/each}
    {/if}
  </table>
</div>

<style>
  .parachain-head {
    min-width: 120px;
  }
  .slot-head {
    position: relative;
    padding: 1em;
    border-bottom: 2px solid #ccc;
    min-width: 180px;
  }
  .slot-time {
    position: absolute;
    top: 1px;
    right: -30px;
    font-weight: 400;
    width: 50px;
  }
  .empty-content {
    height: 80px;
  }
  
</style>