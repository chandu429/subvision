<script>
  import { Link } from 'svelte-navigator';

  import { config } from './constants';
  import ParachainIcon from './ParachainIcon.svelte';
  import { lastBlockNum, lastBlockTime } from './stores';
  import Token from './Token.svelte';
  import { getDateFromBlockNum } from './utils';

  export let parachains;

  const { leasePeriod } = config;
  let paraList = [];

  $: {
    paraList = (parachains || []).map(({funds, leased, ...rest}) => ({
      ...rest,
      crowdloan: funds[0],
      curLease: leased[0] && leased[0].lastSlot * leasePeriod > $lastBlockNum ? leased[0] : null
    }));
  }
  
</script>
{#if paraList.length }
<table class="table table-report mt-6">
  <thead>
    <tr>
      <th class="whitespace-nowrap">Parachain id</th>
      <th class="whitespace-nowrap">Manager</th>
      <th class="text-center whitespace-nowrap">Current Lease</th>
      <th class="text-center whitespace-nowrap">Lease Ends</th>
      <th class="text-right whitespace-nowrap">Won amount</th>
      <th class="text-right whitespace-nowrap">Won Block</th>
      <th class="text-right whitespace-nowrap">Crowdloan</th>
    </tr>
  </thead>
  <tbody>
    {#each paraList as parachain (parachain.paraId)}
      <tr class="intro-x zoom-in">
        <td class="w-40">
          <ParachainIcon paraId={parachain.paraId} />
        </td>
        <td class="">
          <div class="text-gray-600 whitespace-nowrap ellipsis-text w-40" title={parachain.manager}>{parachain.manager}</div>
        </td>
        <td class="text-center">
            {#if parachain.curLease }
              {parachain.curLease?.firstSlot} - {parachain.curLease?.lastSlot}
            {:else}
            N/A
            {/if}
        </td>
        <td>
          <div class="text-center">
            {parachain.curLease ? 'Block '+ parachain.curLease?.lastSlot * leasePeriod : 'N/A'}
            <p class="text-xs">{parachain.curLease ? getDateFromBlockNum(parachain.curLease.lastSlot * leasePeriod, $lastBlockNum, $lastBlockTime) : ''}</p>
          </div>
        </td>
        
        <td>
          <div class="text-right"><Token value={parachain.curLease?.winningAmount} allowZero={true} /> </div>
        </td>
        <td class="">
          <div class="text-right">{parachain.curLease?.blockNum || 'N/A'}</div>
        </td>
        <td>
          <div class="text-right ">
          {#if parachain.crowdloan}
            <Link to="/crowdloan/{parachain.crowdloan.id}" class="btn text-sm">
              View
            </Link>
          {:else}
          N/A
          {/if}
          </div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
{/if}

<style>
  .ellipsis-text {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>