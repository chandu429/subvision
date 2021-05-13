<div>
  <div class="mobile-menu md:hidden">
    <slot name="mobile-menu">Mobile menu</slot>
  </div>

  <div class="flex">
    <nav class="side-nav">
      <slot name="side-menu" />
    </nav>
    <div class="content">
      <slot name="content">Content area</slot>
    </div>
  </div>
</div>
