<script>
  import { Link } from 'svelte-navigator';

  import { config } from './constants';
import MediaQuery from './MediaQuery.svelte';
  import ParachainIcon from './ParachainIcon.svelte';
  import { curLease, lastBlockNum, lastBlockTime } from './stores';
  import Token from './Token.svelte';
  import { getDateFromBlockNum } from './utils';

  export let parachains;

  const { leasePeriod } = config;


</script>
{#if parachains?.length }
<MediaQuery query="(max-width: 640px)" let:matches>
  {#if matches}
    <div>
      {#each parachains as parachain (parachain.id) }
        <div class="box my-4 p-2">
          <div class="flex flex-row justify-between">
            <ParachainIcon paraId={parachain.paraId} align="start" smallIcon/>
            <div>
              {#if parachain.crowdloan}
                <Link to="/crowdloan/{parachain.crowdloan.id}" class="text-sm text-blue-600 underline">
                  Crowdloan
                </Link>
              {/if}
            </div>
          </div>
          <div class="flex justify-between mt-2">
            <div class=" text-left">
              <div class="text-xs text-gray-400">Current Lease</div>
              <div class="">
                {#if parachains.curLease}
                  {parachain.curLease?.firstLease} - {parachain.curLease?.lastLease}
                {:else}
                  N/A
                {/if}
              </div>

            </div>
            <div class="text-center">
              <div class="text-xs text-gray-400">Lease Ends</div>
              <div >{parachain.curLease ? 'Block '+ parachain.curLease?.lastLease * leasePeriod : 'N/A'}</div>
              <div class="text-xs">{parachain.curLease ? getDateFromBlockNum(parachain.curLease.lastLease * leasePeriod, $lastBlockNum, $lastBlockTime) : ''}</div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-400">Won Amount</div>
              <div class=""><Token value={parachain.curLease?.winningAmount} allowZero={true} /></div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="overflow-auto lg:overflow-visible">
      <table class="table table-report mt-6">
        <thead>
          <tr>
            <th class="whitespace-nowrap">Parachain id</th>
            <!-- <th class="whitespace-nowrap">Manager</th> -->
            <th class="text-center whitespace-nowrap">Current Lease</th>
            <th class="text-center whitespace-nowrap">Lease Ends</th>
            <th class="text-right whitespace-nowrap">Won Amount</th>
            <th class="text-right whitespace-nowrap">Auction Result Block</th>
            <th class="text-right whitespace-nowrap">Crowdloan</th>
          </tr>
        </thead>
        <tbody>
          {#each parachains as parachain (parachain.paraId)}
            <tr class="intro-x">
              <td class="w-40">
                <ParachainIcon paraId={parachain.paraId} align="start"/>
              </td>
              <!-- <td class="">
                <div class="text-gray-600 whitespace-nowrap ellipsis-text w-40" title={parachain.manager}>{parachain.manager}</div>
              </td> -->
              <td class="text-center">
                  {#if parachain.curLease }
                    {parachain.curLease?.firstLease} - {parachain.curLease?.lastLease}
                  {:else}
                  N/A
                  {/if}
              </td>
              <td>
                <div class="text-center">
                  {parachain.curLease ? 'Block '+ parachain.curLease?.lastLease * leasePeriod : 'N/A'}
                  <p class="text-xs">{parachain.curLease ? getDateFromBlockNum(parachain.curLease.lastLease * leasePeriod, $lastBlockNum, $lastBlockTime) : ''}</p>
                </div>
              </td>
              
              <td>
                <div class="text-right"><Token value={parachain.curLease?.winningAmount} allowZero={true} /> </div>
              </td>
              <td class="">
                <div class="text-right">{parachain.curLease?.winningResultBlock || 'N/A'}</div>
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
    </div>
  {/if}
  </MediaQuery>
{/if}

<style>
  .ellipsis-text {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>