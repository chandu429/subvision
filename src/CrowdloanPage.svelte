<script>
  import { operationStore, query } from '@urql/svelte';
  import { lastBlockNum, lastBlockTime } from './stores.ts';
  import { CROWDLOAN_QUERY } from './queries.ts';
  import Token from './Token.svelte';
  import { getDateFromBlockNum } from './utils';
  import { Link } from 'svelte-navigator';
  import Loading from './Loading.svelte';
  import Breadcrumb from './Breadcrumb.svelte';
import ParachainIcon from './ParachainIcon.svelte';
import ParachainList from './ParachainList.svelte';

  const crowdloanOps = operationStore(CROWDLOAN_QUERY, null, { requestPolicy: 'network-only'})
  query(crowdloanOps);

  $: crowdloans = $crowdloanOps.data?.crowdloans.nodes || [];
</script>

<div class="content">
  <Breadcrumb links={[{title: 'Parachain', path: '/'}, {title: 'Crowdloan'}]}/>
  {#if $crowdloanOps.fetching }
  <Loading />
  {:else}
  <div class="mt-6">
    <table class="table table-report -mt-2">
      <thead>
        <tr>
          <th class="whitespace-nowrap">Parachain</th>
          <th class="whitespace-nowrap">Creator</th>
          <th class="text-center whitespace-nowrap">First slot</th>
          <th class="text-center whitespace-nowrap">Last slot</th>
          <th class="text-right whitespace-nowrap">Raised / Cap</th>
          <th class="text-right whitespace-nowrap">Ends</th>
          <th class="text-center whitespace-nowrap">Status</th>
          <th class="text-center whitespace-nowrap">Contributors</th>
        </tr>
      </thead>
      <tbody>
        {#each crowdloans as crowdloan (crowdloan.id) }
          <tr class="intro-x zoom-in">
            <td class="">
              <ParachainIcon paraId={crowdloan.parachain.paraId} />
            </td>
            <td class="">
              <div class="text-gray-600 whitespace-nowrap ellipsis-text w-40" title={crowdloan.depositor}>{crowdloan.depositor}</div>
            </td>
            <td><div class="text-center ">{crowdloan.firstSlot}</div></td>
            <td><div class="text-center ">{crowdloan.lastSlot}</div></td>
            <td>
              <div class="text-right"><Token value={crowdloan.raised} allowZero={true} addSymbol={false} /> / <Token allowZero={true} value={crowdloan.cap} /></div>
              <div class="text-right">{((crowdloan.raised / crowdloan.cap) * 100).toFixed(2)}%</div>
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
  
</div>

<style>
  .ellipsis-text {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>