<script>
  import { Link } from 'svelte-navigator';
  import ChevronIcon from './ChevronIcon.svelte';
  import { timeStr, lastBlockNum } from './stores.ts';
  export let links = [];

</script>

<div class="top-bar">
  <div>
    {#each links as link}
      {#if link.path}
        <Link to={link.path}>{link.title}</Link><ChevronIcon />
      {:else}
        <span>{link.title}</span>
      {/if}
    {/each}
  </div>
  <div class="text-right flex-1">
    {$timeStr}
    <div class="text-gray-400 text-xs">Block: {$lastBlockNum}</div>
  </div>
</div>