<script>
import AuctionProgressIndicator from './AuctionProgressIndicator.svelte';
import LeaseCard from './LeaseCard.svelte';
import BidCard from './BidCard.svelte';
import { chronicle } from './stores';
import { round } from 'lodash-es';
import SlotsCombination from './SlotsCombination.svelte';
import MediaQuery from './MediaQuery.svelte';
import { Link } from 'svelte-navigator';
export let curAuction, latestBids;

$: closingPeriod = curAuction.closingEnd - curAuction.closingStart;
$: biddingLeases = curAuction.parachainLeases.map(({ numBlockWon, ...others }) => ({
    ...others,
    leadingRate: numBlockWon && round(((numBlockWon - 1) / closingPeriod), 4)
  }));

</script>

<div >
  <div class="">
    <div class="block sm:flex items-center text-center">
      <h2 class="text-lg font-medium mr-5">Auction No.{curAuction.id}</h2>
    </div>
    <div class="mt-1 sm:mt-4">
      <div class="box flex flex-none flex-row divide-x divide-gray-200 p-3 sm:p-4 justify-between">
        <div class="flex-grow px-1">
          <div class="text-gray-600 dark:text-gray-600 text-center">Lease Periods</div>
          <div class="text-sm sm:text-lg font-bold mt-4 text-center flex flex-col sm:flex-row justify-center flex-wrap">
            <div>{curAuction?.slotsStart || ''}</div>
            <div class="sm:mx-2">-</div>
            <div>{curAuction?.slotsEnd || ''}</div>
          </div>
        </div>
        <div class="flex-grow px-1">
          <div class="text-gray-600 dark:text-gray-600 text-center">Auction Stage</div>
          <div class="text-sm sm:text-lg font-bold mt-4 text-center flex sm:flex-row flex-col justify-center flex-wrap">
            <div>{curAuction.blockNum}</div>
            <div class="mx-1 sm:mx-2">-</div>
            <div>{curAuction.closingStart - 1}</div>
          </div>
        </div>
        <div class="flex-grow px-1">
          <div class="text-gray-600 dark:text-gray-600 text-center">Ending Stage</div>
          <div class="text-sm sm:text-lg font-bold mt-4 text-center flex flex-col sm:flex-row justify-center flex-wrap ">
            <div>{curAuction.closingStart}</div>
            <div class="mx-1 sm:mx-2">-</div>
            <div>{curAuction.closingEnd}</div>
          </div>
        </div>

          <MediaQuery query="(min-width: 600px)" let:matches>
            {#if matches}
              <AuctionProgressIndicator closingStart={curAuction?.closingStart } closingEnd={ curAuction?.closingEnd} curBlockNum={$chronicle?.curBlockNum} auctionStart={curAuction?.blockNum} />
            {/if}
          </MediaQuery>

      </div>
    </div>
  </div>

  <MediaQuery query="(max-width: 640px)" let:matches>
    {#if matches}
    <div class="box mt-4 p-4">
      <AuctionProgressIndicator closingStart={curAuction?.closingStart } closingEnd={curAuction?.closingEnd} curBlockNum={$chronicle?.curBlockNum} auctionStart={curAuction?.blockNum} />
    </div>
    {/if}
  </MediaQuery>

  <div class="mt-6">
    <SlotsCombination leases={biddingLeases} firstLease={curAuction.leaseStart} />
  </div>
  <div class="flex flex-row justify-between">
    <MediaQuery query="(min-width: 600px)" let:matches>
      {#if matches}
        {#if curAuction.parachainLeases.length}
          <div class="my-4 w-3/5 flex-grow">
            <div class="py-2 text-lg text-center md:text-left lg:text-left">
              <p>Leading Positions</p>
            </div>
            <div class="">
              <div class="grid gap-4">
                {#each biddingLeases as lease }
                  <LeaseCard {...lease } />
                {/each}
              </div>
            </div>
          </div>
        {/if}
      {/if}
    </MediaQuery>
    {#if latestBids.length}
      <div class="mt-4 sm:ml-4 sm:w-2/5 flex-grow">
        <div class="py-2 text-lg text-center md:text-left lg:text-left">
          <p>Latest Bids</p>
        </div>
        <div class="box">
          {#each latestBids as bid}
            <BidCard { ...bid } />
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>