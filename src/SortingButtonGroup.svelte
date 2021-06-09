<script>
  export let title;
</script>

<div class="flex text-right justify-end">
  <div class="">{title}</div>
  <div class="btn-groups">
    <span class="chevron top"></span>
    <span class="chevron bottom"></span>
  </div>
</div>

<style>
  .btn-groups {
    position: relative;
    margin: 0 5px;
  }
  .chevron::before {
    border-style: solid;
    border-width: 0.25em 0.25em 0 0;
    content: '';
    display: inline-block;
    height: 0.45em;
    position: absolute;
    top: 0;
    transform: rotate(-45deg);
    vertical-align: top;
    width: 0.45em;
    color: black;
  }

  .chevron.top:before {
    top: 5px;
  }

  .chevron.right:before {
    left: 0;
    transform: rotate(45deg);
  }

  .chevron.bottom:before {
    top: 10px;
    transform: rotate(135deg);
  }

  .chevron.left:before {
    left: 0.25em;
    transform: rotate(-135deg);
  }
</style>