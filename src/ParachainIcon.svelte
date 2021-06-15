<script context="module" lang="typescript">
  import { config } from './constants';

  interface ParachainInfo {
    paraid: string;
    name: string;
    token?: string;
    description?: string;
    website?: string;
    icon: string;
  }

  const { defaultChains } = config;
  let paraMappings: Record<string, ParachainInfo> = {};
  fetch(config.paraMappingUrl)
    .then(response => response.json() as Promise<ParachainInfo[]>)
    .then((data: ParachainInfo[]) => (defaultChains).concat(data))
    .then((data: ParachainInfo[]) => {
      paraMappings = (data || []).reduce((all, { paraid, ...rest}) => ({...all, [paraid]: rest, id: paraid }), {})
    })

</script>

<script>
  export let paraId, smallIcon = false, align='center', showText=true;
  const parachain = paraMappings[paraId];
</script>

<div class="flex items-center justify-{align}" alt="{paraId}"> 
  <div class="{smallIcon ? 'w-6 h-6' : 'w-10 h-10'} flex-none image-fit rounded-full overflow-hidden mr-2" alt="{paraId}">
    <img alt="{parachain?.name || paraId}" src="{parachain?.icon || config.defaultParachainIcon}">
  </div>
  {#if showText}
  <div class="text-sm" alt="{paraId}">
    {#if parachain}
      <div title={paraId}>
        {#if parachain.website}
          <a href="{parachain.website}" target="_blank" class="text-blue-900" on:click={() => false}>{parachain?.name}</a>
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