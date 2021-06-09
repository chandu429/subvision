<script>
import AuctionProgressIndicator from './AuctionProgressIndicator.svelte';
import LeaseCard from './LeaseCard.svelte';
import BidCard from './BidCard.svelte';
import { chronicle } from './stores';
import { round } from 'lodash-es';
import SlotsCombination from './SlotsCombination.svelte';
export let curAuction, latestBids;

$: closingPeriod = curAuction.closingEnd - curAuction.closingStart;
$: biddingLeases = curAuction.parachainLeases.map(({ numBlockWon, ...others }) => ({
    ...others,
    leadingRate: numBlockWon && round(((numBlockWon - 1) / closingPeriod), 4)
  }));

</script>

<div class="grid grid-cols-12 gap-6">
  <div class="col-span-12 lg:col-span-12 xl:col-span-12 mt-2">
    <div class="block sm:flex items-center h-10">
      <h2 class="text-lg font-medium mr-5">Current Auction</h2>
    </div>
    <div class="mt-4 sm:mt-1">
      <div class="box grid grid-cols-6 gap-4 divide-x divide-gray-200 p-4">
        <div class="justify-center">
          <div class="mt-1 text-gray-600 dark:text-gray-600 text-center">Auction Index</div>
          <div class="text-3xl font-bold mt-4 text-center">{curAuction?.id || ''}</div>
        </div>
        <div class="justify-center">
          <div class="mt-1 text-gray-600 dark:text-gray-600 text-center">Lease Periods</div>
          <div class="text-3xl font-bold mt-4 text-center">{curAuction?.slotsStart || ''} - {curAuction?.slotsEnd || ''}</div>
        </div>
        <div class="justify-center">
          <div class="mt-1 text-gray-600 dark:text-gray-600 text-center">Auction Stage</div>
          <div class="text-lg font-bold mt-4 text-center">{curAuction.blockNum} - {curAuction.closingStart - 1}</div>
        </div>
        <div class="justify-center">
          <div class="mt-1 text-gray-600 dark:text-gray-600 text-center">Ending Stage</div>
          <div class="text-lg font-bold mt-4 text-center">{curAuction.closingStart} - {curAuction.closingEnd}</div>
        </div>
        
          <AuctionProgressIndicator closingStart={curAuction?.closingStart } closingEnd={ curAuction?.closingEnd} curBlockNum={$chronicle?.curBlockNum} auctionStart={curAuction?.blockNum} />
      </div>
    </div>
  </div>

  <div class="col-span-12">
    <SlotsCombination leases={biddingLeases} firstLease={curAuction.leaseStart} />
  </div>

  <div class="col-span-8 m:col-span-12 s:col-span-12 my-4">
    <div class="py-2 text-lg">
      <p>Leading Positions</p>
    </div>
    <div class="">
      {#if curAuction.parachainLeases.length}
      <div class="grid gap-6">
        {#each biddingLeases as lease }
          <LeaseCard {...lease } />
        {/each}
      </div>
      {/if}
    </div>
  </div>
  <div class="col-span-4 m:col-span-12 s:col-span-12 mt-4">
    <div class="py-2 text-lg">
      <p>Latest Bids</p>
    </div>
    <div >
      {#each latestBids as bid}
        <BidCard { ...bid } />
      {/each}
    </div>
  </div>
</div>