<script>
  import { range } from 'lodash-es';
  import { config } from './constants';
  import ProgressBar from './ProgressBar.svelte';
  import { lastBlockNum, lastBlockTime } from './stores';
  import { getDateFromBlockNum, getColSpan } from './utils';
  export let leases;
  const { leasePeriod } = config;

  let activeLeases, slotIdxs, allSlots;

  $: {

    const defaultSlotStart = Math.ceil($lastBlockNum / leasePeriod);
    const defaultSlotEnd = defaultSlotStart + 4;

    activeLeases = leases
      .filter(({ lastSlot }) => lastSlot * leasePeriod > $lastBlockNum)
      .map(({firstSlot, lastSlot, ...rest}) => ({ slots: range(firstSlot, lastSlot+1), firstSlot, lastSlot, ...rest }));

    const [first, last] = activeLeases.reduce(([earliest, lastest], {firstSlot, lastSlot}) => {
      const first = Math.min(earliest, firstSlot);
      const last = Math.max(lastest, lastSlot);
      return [first, last];
    }, [defaultSlotStart, defaultSlotEnd]);

    slotIdxs = range(first, last+1);
    allSlots = slotIdxs.map((slotIdx) => ({ idx: slotIdx, startBlock: slotIdx * leasePeriod }));

  }
</script>

<div class="box overflow-x-scroll p-2">
  <table class="w-full text-center">
    <tr>
      <th class="empty-head"></th>
      {#each allSlots as slot (slot.idx)}
      <td>
        <div class="slot-head">
          <p class="text-lg">Slot {slot.idx}</p>
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
    {#each activeLeases as lease (lease.id)}
    <tr>
      <td class="py-4">
        <div class="flex justify-center items-center">
          <img class="mx-1 rounded-full" src="./ksm-logo.png" alt="{lease.parachain.paraId}" width="22" height="22">
          <div class="text-gray-400 text-lg">{lease.parachain.paraId}</div>
        </div>
      </td>
      {#each getColSpan(slotIdxs, lease.slots) as span}
      <td colspan="{span}">
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
  .empty-head {
    width: 150px;
  }
  .slot-head {
    position: relative;
    padding: 1em;
    border-bottom: 2px solid #ccc;
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