<script>
  import MobileMenu from './MobileMenu.svelte';
  import MediaQuery from './MediaQuery.svelte';
  import { timeStr, lastBlockNum, curLease, curAuction } from './stores.ts';
  import EmailSubscriptionPanel from './EmailSubscriptionPanel.svelte';
  import { useNavigate } from 'svelte-navigator';

  const navigate = useNavigate();
</script>

<div>
  <MediaQuery query="(max-width: 600px)" let:matches="{isMobile}">
    {#if isMobile}
      <div class="mobile-menu">
        <slot name="mobile-menu">
          <MobileMenu />
        </slot>
      </div>
      <div class="flex justify-between my-4">
        <div class="text-left text-white">
          <div class="text-xs">Current lease: {$curLease || 'N/A'}</div>
          <div class="text-xs">Current Auction: {$curAuction?.id || 'N/A'}</div>
        </div>
        <div class="text-white text-right">
          <div class="text-xs">{$timeStr || 'N/A'}</div>
          <div class="text-xs">Block: {$lastBlockNum || 'N/A'}</div>
        </div>
      </div>
      <EmailSubscriptionPanel />
    {/if}
  </MediaQuery>
  <div class="flex">
    <nav class="side-nav">
      <slot name="side-menu" />
    </nav>
    <div></div>
    <div class="content">
      <slot name="content">Content area</slot>
    </div>
  </div>
  <footer class="flex flex-wrap items-center justify-between pt-4 m-auto">
    <div class="container mx-auto flex flex-col flex-wrap items-center justify-between">
      <div class="text-white"><button on:click="{() => navigate('/private-policy')}"> Private Policy </button></div>
      <div class="text-white"> Subvis.io © 2021 </div>
    </div>
  </footer>
</div>
