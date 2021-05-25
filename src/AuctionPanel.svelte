<script>
import AuctionProgressIndicator from './AuctionProgressIndicator.svelte';
import AuctionSlot from './AuctionSlot.svelte';
import BidCard from './BidCard.svelte';
import { chronicle } from './stores';
export let curAuction, groupedSlots, latestBids;

</script>

<div class="grid grid-cols-12 gap-6">
  <div class="col-span-12 lg:col-span-12 xl:col-span-12 mt-2">
    <div class="block sm:flex items-center h-10">
      <h2 class="text-lg font-medium mr-5">Current Auction</h2>
    </div>

    <div class="mt-4 sm:mt-1">
      <div class="box grid grid-cols-5 gap-4 divide-x divide-gray-200 p-4">
        <div class="justify-center">
          <div class="mt-1 text-gray-600 dark:text-gray-600 text-center">Auction Index</div>
          <div class="text-3xl font-bold mt-4 text-center">{curAuction?.id || ''}</div>
        </div>
        <div class="justify-center">
          <div class="mt-1 text-gray-600 dark:text-gray-600 text-center">Current Lease</div>
          <div class="text-3xl font-bold mt-4 text-center">{curAuction?.slotsStart || ''} - {curAuction?.slotsEnd || ''}</div>
        </div>
        <div class="justify-center">
          <div class="mt-1 text-gray-600 dark:text-gray-600 text-center">Current Block</div>
          <div class="text-3xl font-bold mt-4 text-center">{chronicle?.curBlockNum}</div>
        </div>
        <AuctionProgressIndicator closingStart={curAuction?.closingStart } closingEnd={ curAuction?.closingEnd} curBlockNum={chronicle?.curBlockNum} auctionStart={curAuction?.blockNum} />
      </div>
    </div>
  </div>
  <div class="col-span-8 m:col-span-12 s:col-span-12 my-4">
    <div class="py-2 text-lg">
      <p>Auction Slots</p>
    </div>
    <div class="">
      <div class="">
      {#each groupedSlots as slots, groupIdx}
        <div class="box mb-6 py-4">
          <div class="pl-4 text-base">
            <p>Group {slots.length}</p>
          </div>
          <div class="grid grid-cols-12 gap-6 gap-y-8 p-4">
            {#each slots as slot }
              <AuctionSlot {...slot } {groupIdx}/>
            {/each}
          </div>
        </div>
      {/each}
      </div>
    </div>
  </div>
  <div class="col-span-4 m:col-span-12 s:col-span-12 mt-4">
    <div class="py-2 text-lg">
      <p>Live Bids</p>
    </div>
    <div >
      {#each latestBids as bid}
        <BidCard { ...bid } />
      {/each}
    </div>
  </div>
</div>