<script>
  export let title;
</script>

<div class="flex text-right justify-end min-w-max">
  <div class="">{title}</div>
  <div class="btn-groups relative mr-4">
    <span class="material-icons up-btn">arrow_drop_up</span>
    <span class="material-icons down-btn">arrow_drop_down</span>
  </div>
</div>

<style>
  .btn-groups {
    transform: scale(0.75, 0.75);
  }

  .up-btn {
    position: absolute;
    top: -6px;

  }

  .down-btn {
    position: absolute;
    top: 3px;
  }
  
</style>