<script>
  import { operationStore, query } from '@urql/svelte';
  import { navigate } from "svelte-navigator";
  import { lastBlockNum, lastBlockTime } from './stores.ts';
  import { CROWDLOAN_QUERY } from './queries.ts';
  import Token from './Token.svelte';
  import { getDateFromBlockNum } from './utils';
  import { Link } from 'svelte-navigator';
  import Loading from './Loading.svelte';
  import Breadcrumb from './Breadcrumb.svelte';
  import ParachainIcon from './ParachainIcon.svelte';
  import { onMount } from 'svelte';
import MediaQuery from './MediaQuery.svelte';

  let timer = 0;

  const crowdloanOps = operationStore(CROWDLOAN_QUERY, null, { requestPolicy: 'network-only'})
  query(crowdloanOps);

  onMount(async () => {
    if (!timer) {
      timer = setInterval(() => {
        crowdloanOps.update((origin) => {
          origin.context = {...origin.context, timeFlag: Math.random()}
        })
      }, 2500);
    }

    return () => {
      clearInterval(timer);
      timer = 0;
    }
  });

  $: crowdloans = $crowdloanOps.data?.crowdloans.nodes || [];
</script>

<div class="content">
  <Breadcrumb links={[{title: 'Parachain', path: '/'}, {title: 'Crowdloan'}]}/>
  {#if $crowdloanOps.fetching && !crowdloans.length }
  <Loading />
  {:else}
  <MediaQuery query="(max-width: 600px)" let:matches={isMobile}>
    {#if isMobile}
      {#each crowdloans as crowdloan (crowdloan.id) }
        <div class="box my-4 p-2" on:click={e => navigate(`/crowdloan/${crowdloan.id}`)}>
          <div class="flex flex-row justify-between">
            <ParachainIcon paraId={crowdloan.parachain.paraId} align="start" smallIcon/>
            <div>
              <div class="rounded-full py-1 px-2 text-white text-sm {crowdloan.retiring ? 'bg-yellow-600' : 'bg-blue-500'}">{crowdloan.retiring ? 'Retiring' : 'Active'}</div>
            </div>
          </div>
          <div class="flex justify-between mt-2">
            <div class=" text-left">
              <div class="text-xs text-gray-400">Lease</div>
              <div class="text-lg">{crowdloan.firstSlot} - {crowdloan.lastSlot}</div>
            </div>
            
            <div class="text-right">
              <div class="text-xs  text-gray-400">Contributions</div>
              <div class="text-lg">{(crowdloan.parachain.contributions?.totalCount || 0).toLocaleString()}</div>
            </div>
          </div>
          <div class="flex justify-between mt-1">
            <div class="text-left">
              <div class="text-xs text-gray-400">Expiration</div>
              <div class="">{getDateFromBlockNum(crowdloan.lockExpiredBlock, $lastBlockNum, $lastBlockTime)}</div>
              <div class="text-xs">Block: {crowdloan.lockExpiredBlock}</div>
            </div>
            <div class="text-right">
              <div class="text-xs  text-gray-400">Raised / Cap</div>
              <div><Token value={crowdloan.raised} allowZero={true} addSymbol={false} /> / <Token allowZero={true} value={crowdloan.cap} /></div>
              <div class="text-xs">{((crowdloan.raised / crowdloan.cap) * 100).toFixed(2)}%</div>
            </div>
          </div>
        </div>
      {/each}
    {:else}
      <div class="mt-6 overflow-auto lg:overflow-visible">
        <table class="table table-report -mt-2">
          <thead>
            <tr>
              <th class="whitespace-nowrap">Parachain</th>
              <th class="text-center whitespace-nowrap">First Lease</th>
              <th class="text-center whitespace-nowrap">Last Lease</th>
              <th class="text-right whitespace-nowrap">Raised / Cap</th>
              <th class="text-right whitespace-nowrap">Contributions</th>
              <th class="text-right whitespace-nowrap">Expiration</th>
              <th class="text-center whitespace-nowrap">Status</th>
              <th class="text-center whitespace-nowrap">Contributors</th>
            </tr>
          </thead>
          <tbody>
            {#each crowdloans as crowdloan (crowdloan.id) }
              <tr class="intro-x zoom-in" on:click={e => navigate(`/crowdloan/${crowdloan.id}`)}>
                <td class="">
                  <ParachainIcon paraId={crowdloan.parachain.paraId} align="start"/>
                </td>
                <!-- <td class="md:table-cell">
                  <div class="text-gray-600 whitespace-nowrap ellipsis-text lg:w-40 sm:w-6" title={crowdloan.depositor}>{crowdloan.depositor}</div>
                </td> -->
                <td><div class="text-center ">{crowdloan.firstSlot}</div></td>
                <td><div class="text-center ">{crowdloan.lastSlot}</div></td>
                <td>
                  <div class="text-right"><Token value={crowdloan.raised} allowZero={true} addSymbol={false} /> / <Token allowZero={true} value={crowdloan.cap} /></div>
                  <div class="text-right">{((crowdloan.raised / crowdloan.cap) * 100).toFixed(2)}%</div>
                </td>
                <td>
                  <div class="text-right">{crowdloan.parachain.contributions?.totalCount || 0}</div>
                </td>
                <td class="">
                  <div class="text-right">Block: {crowdloan.lockExpiredBlock}</div>
                  <div class="text-right text-gray-600">{getDateFromBlockNum(crowdloan.lockExpiredBlock, $lastBlockNum, $lastBlockTime)}</div>
                </td>
                <td class="">
                  <div class="flex justify-center items-center">{crowdloan.retiring ? 'Retiring' : 'Active'}</div>
                </td>
                <td class="text-center">
                  <Link to="/crowdloan/{crowdloan.id}" class="btn text-sm">
                    View
                  </Link>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </MediaQuery>

  
  {/if}
  
</div>

<style>
  .ellipsis-text {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>