<script>
import MobileMenu from "./MobileMenu.svelte";

</script>
<div>
  <div class="mobile-menu md:hidden">
    <slot name="mobile-menu">
      <MobileMenu />
    </slot>
  </div>

  <div class="flex">
    <nav class="side-nav">
      <slot name="side-menu" />
    </nav>
    <div class="content">
      <slot name="content">Content area</slot>
    </div>
  </div>
  <footer class="flex flex-wrap items-center justify-between pt-4 m-auto">
    <div class="container mx-auto flex flex-col flex-wrap items-center justify-between">
        <ul class="flex mx-auto text-white text-center">
          <li class="p-2 ">Terms & Conditions</li>
          <li class="p-2 ">Privacy</li>
          <li class="p-2 ">Cookies</li>
        </ul>
        <div class="flex mx-auto text-white text-center">
            Subvis.io © 2021
        </div>
    </div>
</footer>
</div>
