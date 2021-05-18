<script>
  import { range, minBy, maxBy } from 'lodash-es';
  import { config } from './constants';
  import ProgressBar from './ProgressBar.svelte';
  import { lastBlockNum, lastBlockTime } from './stores';
  import { getDateFromBlockNum, getColSpan } from './utils';
  export let leases;
  const { leasePeriod, leasesPerSlot } = config;

  let activeLeases, slotIdxs, allSlots;

  $: {

    activeLeases = leases
      // .filter(({ lastSlot }) => lastSlot * leasePeriod > $lastBlockNum)
      .map(({firstSlot, lastSlot, ...rest}) => ({ slots: range(firstSlot, lastSlot), firstSlot, lastSlot, ...rest }));

    const defaultSlotStart = Math.ceil($lastBlockNum / leasePeriod);
    const defaultSlotEnd = defaultSlotStart + leasesPerSlot;

    const leaseSlotStart = minBy(leases, "firstSlot")?.firstSlot;
    const leaseSlotEnd = maxBy(leases, "lastSlot")?.lastSlot;
    
    const slotStart = Math.min(leaseSlotStart || defaultSlotStart, defaultSlotStart);
    const slotEnd = Math.max(leaseSlotEnd || defaultSlotEnd, defaultSlotEnd);
    
    // console.log({ leaseSlotStart, leaseSlotEnd, defaultSlotStart, defaultSlotEnd, slotStart, slotEnd });
    slotIdxs = range(slotStart, slotEnd+1);
    allSlots = slotIdxs.map((slotIdx) => ({ idx: slotIdx, startBlock: slotIdx * leasePeriod }));
  }
</script>

<div class="box overflow-x-scroll py-2">
  <table class="w-full text-center">
    <tr>
      <th class="parachain-head"></th>
      {#each allSlots as slot}
      <td>
        <div class="slot-head">
          <p class="text-lg">Lease {slot.idx}</p>
          <p class="text-gray-400 text-xs">{slot.startBlock} - {slot.startBlock + leasePeriod}</p>
          <div class="slot-time text-gray-400 text-xs">{getDateFromBlockNum(slot.startBlock, $lastBlockNum, $lastBlockTime)}
          </div>
        </div>
      </td>
      {/each}
    </tr>
    {#if !activeLeases.length} 
    <tr>
      <td></td>
      <td colspan={allSlots.length}>
        <div class="flex empty-content justify-center items-center">
          <div>No parachain leased yet</div>
        </div>
      </td>
    </tr>
    {/if}
    {#each activeLeases as lease, idx (lease.id)}
    <tr class="{idx % 2 > 0 ? 'bg-gray-100':''}">
      <td class="py-4">
        <div class="flex justify-center items-center">
          <img class="mx-1 rounded-full" src="./ksm-logo.png" alt="{lease.parachain.paraId}" width="22" height="22">
          <div class="text-gray-400 text-xs">{lease.parachain.paraId}</div>
        </div>
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
  </table>
</div>

<style>

  .parachain-head {
    min-width: 150px;
  }
  .slot-head {
    position: relative;
    padding: 1em;
    border-bottom: 2px solid #ccc;
    min-width: 150px;
  }
  .slot-time {
    position: absolute;
    top: 1px;
    left: -30px;
    font-weight: 400;
    width: 50px;
  }
  .empty-content {
    height: 240px;
  }
  
</style>