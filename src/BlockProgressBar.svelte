<script>
  import { getTimeDiffInWord } from './utils';
  export let end, current;

  const blockDiff = Math.max((end - current), 0);
  const timeRemain = blockDiff * 6000;
  const timeDiff = getTimeDiffInWord(timeRemain);
  const progress = blockDiff > 0 ? ((current / end) * 100).toFixed(2) : 100;

</script>

<div class="m-auto">
  <div class="progress h-3">
    <div class="progress-bar bg-theme-1" role="progressbar" style="width: {progress}%">{progress}</div>
  </div>
  
</div>