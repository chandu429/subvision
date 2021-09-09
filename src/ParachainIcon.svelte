<script context="module" lang="typescript">
  import { config } from './constants';
  import { paraMappings } from './stores';

  interface ParachainInfo {
    paraid: string;
    name: string;
    token?: string;
    description?: string;
    website?: string;
    icon: string;
  }

  const { defaultChains } = config;

  fetch(config.paraMappingUrl)
    .then(response => response.json() as Promise<ParachainInfo[]>)
    .then((data: ParachainInfo[]) => (defaultChains).concat(data))
    .then((data: ParachainInfo[]) => {
      paraMappings.set((data || []).reduce((all, { paraid, ...rest}) => ({...all, [paraid]: rest, id: paraid }), {}))
    })

</script>

<script>
  export let paraId, smallIcon = false, showText=true, dropShadow=false;
  export let align='start';
  const parachain = $paraMappings?.[paraId];
</script>

<div class="flex items-center justify-{align}" alt="{paraId}">
  <div class="{smallIcon ? 'w-6 h-6 ml-4' : 'w-10 h-10'} flex-none image-fit rounded-full overflow-hidden mr-2 {dropShadow ? 'drop-shadow' : ''}" alt="{paraId}">
    <img alt="{parachain?.name || paraId}" src="{parachain?.icon || config.defaultParachainIcon}">
  </div>
  {#if showText}
  <div class="text-sm text-left" alt="{paraId}">
    {#if parachain}
      <div title={paraId}>
        {#if parachain.website}
          <a href="{parachain.website}" target="_blank" class="text-blue-900" on:click|stopPropagation={() => false}>{parachain?.name}</a>
        {:else}
          {parachain?.name}
        {/if}
      </div>
    {:else}
      {paraId || ''}
    {/if}
  </div>
  {/if}
</div>

<style>
  .drop-shadow {
    filter: drop-shadow(2px 2px 5px gray)
  }
</style>
