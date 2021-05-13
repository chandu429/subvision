<script>
  import AuctionSlot from './AuctionSlot.svelte';
  import { time } from './stores.ts';
  import { operationStore, query } from '@urql/svelte';
  import { AUCTION_QUERY } from './queries';
  import { normalize, getSlotsCombination } from './utils.ts';
  import groupBy from 'lodash-es/groupBy';
  import orderBy from 'lodash-es/orderBy';
  import BidCard from './BidCard.svelte';
  import AuctionProgressIndicator from './AuctionProgressIndicator.svelte';
  import { curAuction, chronicle } from './stores';
  import { onMount, onDestroy } from 'svelte';

  let timer = 0;

  const formatter = new Intl.DateTimeFormat('en', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  });

  const activeAuction = {
    auctionStatusFilter: {
      ongoing: {
        equalTo: true
      }
    }
  };

  const activeAuctions = operationStore(AUCTION_QUERY, activeAuction, { requestPolicy: 'network-only', timeFlag: 0 });
  query(activeAuctions);

  onMount(async () => {
    setInterval(() => {
      activeAuctions.update((origin) => {
        origin.context = {...origin.context, timeFlag: Math.random()}
      })
    }, 5000);
  });

  onDestroy(() => {
    if (timer) {
      clearInterval(timer);
    }
  })

  $: {
    if ($activeAuctions.data) {
      const { auctions, chronicle: curChronicle } = normalize($activeAuctions.data) || {};
      const [auction] = auctions;
      if (auction) {
        curAuction.set(auction)
      }
      if (curChronicle) {
        chronicle.set(curChronicle)
      }
    }
  }

  $: slotsCombination = $curAuction ? getSlotsCombination($curAuction.slotsStart) : [];
  $: slotsWithWiningBid = slotsCombination.map(({ start, end }) => {
    const { amount, parachain, isCrowdloan, bidder } = $curAuction.winningBids.find(({ firstSlot, lastSlot }) => firstSlot == start && lastSlot == end) || {};
    const { paraId, manager, id, deposit, creationBlock } = parachain || {};
    return { firstSlot: start, lastSlot: end, isCrowdloan, amount, bidder, paraId, manager, id, deposit, creationBlock, start, end };
  })
  $: groupedSlots = orderBy(Object.values(groupBy(slotsWithWiningBid, ({ start, end }) => end - start)), ['length'], ['asc']);
  $: latestBids = $curAuction ? orderBy([].concat($curAuction.winningBids, $curAuction.loseBids), ['createdAt'], ['desc']).slice(0, 10) : [];

</script>

<div class="content">
  <div class="top-bar">
    <div>
      Parachain <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-chevron-right breadcrumb__icon"><polyline points="9 18 15 12 9 6" /></svg
      > <a href="/" class="breadcrumb--active">Auction</a>
    </div>
    <div class="text-right flex-1">
      {formatter.format($time)}
    </div>
  </div>
  {#if activeAuctions.fetch}
  <div class="h-screen">
    <span class="text-blue-500 opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0" style="top: 30%;">
      <i class="fas fa-circle-notch fa-spin fa-5x"></i>
    </span>
  </div>
  {:else if !curAuction}
  <div class="h-screen">
    <span class="text-blue-500 opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0" style="top: 30%;">
      Auction ended
    </span>
  </div>
  {:else}
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 lg:col-span-12 xl:col-span-12 mt-2">
      <div class="intro-y block sm:flex items-center h-10">
        <h2 class="text-lg font-medium truncate mr-5">Current Auction</h2>
      </div>

      <div class="mt-4 sm:mt-1">
        <div class="box grid grid-cols-5 gap-4 divide-x divide-gray-200 p-4">
          <div class="justify-center">
            <div class="mt-1 text-gray-600 dark:text-gray-600 text-center">Auction Index</div>
            <div class="text-3xl font-bold mt-4 text-center">{$curAuction?.id || ''}</div>
          </div>
          <div class="justify-center">
            <div class="mt-1 text-gray-600 dark:text-gray-600 text-center">Current Lease</div>
            <div class="text-3xl font-bold mt-4 text-center">{$curAuction?.slotsStart || ''} - {$curAuction?.slotsEnd || ''}</div>
          </div>
          <div class="justify-center">
            <div class="mt-1 text-gray-600 dark:text-gray-600 text-center">Current Block</div>
            <div class="text-3xl font-bold mt-4 text-center">{$chronicle?.curBlockNum}</div>
          </div>
          <AuctionProgressIndicator closingStart={$curAuction?.closingStart } closingEnd={ $curAuction?.closingEnd} curBlockNum={$chronicle?.curBlockNum} auctionStart={$curAuction?.blockNum} />
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
  {/if}
  
</div>
