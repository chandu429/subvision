<script>
  import Big from 'big.js';
  import { config } from './constants';
  export let value;
  export let allowZero = false;
  export let emptyDisplay = '';

  const { decimal, tokenSymbol } = config;
  $: tokenValue = Big(value||0).div(10 ** decimal).toNumber();
  $: title = !allowZero && tokenValue == 0 ? emptyDisplay : `${tokenValue} ${tokenSymbol}`;

</script>

<div class="inline-block">{title}</div>