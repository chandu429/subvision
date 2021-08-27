<script>
  import { Link } from 'svelte-navigator';
  import ChevronIcon from './ChevronIcon.svelte';
  import EmailSubscriptionPanel from './EmailSubscriptionPanel.svelte';
  import { timeStr, lastBlockNum, curLease } from './stores.ts';
  export let links = [];

</script>

<div class="top-bar">
  <div class="text-base">
    {#each links as link}
      {#if link.path}
        <Link to={link.path}><span class="text-blue-600 underline">{link.title || ''}</span></Link><ChevronIcon />
      {:else}
        <span class="text-md">{link.title || ''}</span>
      {/if}
    {/each}
  </div>
  <div class="text-right flex-1 text-sm">
    {$timeStr || ' '}
    <div class="text-gray-400 text-xs">Block: {$lastBlockNum}</div>
    <div class="text-gray-400 text-xs">Current lease: {$curLease || 'N/A'}</div>
  </div>
  
</div>