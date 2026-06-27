<script>
  import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
  import House from '@lucide/svelte/icons/house';
  import Gamepad from '@lucide/svelte/icons/gamepad-directional';
  let open = $state(false);
</script>

<!-- Larger Screens -->
<nav class="hidden md:block w-full bg-base-300 opacity-95 sticky top-0 z-1000">
  <div class="flex flex-row justify-between items-center px-10 py-4">
    <!-- Left: Home Icon -->
    <a href="/" class="btn btn-ghost p-2">
        <House size={28} />
    </a>

    <!-- Center -->
    <a class="btn btn-ghost p-2" href="/games">
        <Gamepad size={28} />
        Games
    </a>

    <!-- Right -->
    <ThemeSwitcher />
  </div>
</nav>

<!-- Smaller Screens -->
<nav class="md:hidden w-full bg-base-300 opacity-95 sticky top-0 z-1000">
  <div class="flex flex-row justify-between items-center px-4 py-3">
    <!-- Left: Home Icon -->
    <a href="/" class="btn btn-ghost p-2">
        <House size={28} />
    </a>

    <!-- Right: Theme + Hamburger -->
    <div class="flex items-center gap-2">
      <ThemeSwitcher />
      <button onclick={() => open = !open} class="btn btn-ghost text-2xl p-2">
        {open ? '✕' : '☰'}
      </button>
    </div>
  </div>

  <!-- Dropdown: opens from right -->
  {#if open}
    <div class="absolute right-0 top-full mt-1 w-48 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 flex flex-col p-2 gap-2">
        <a href="/" class="btn btn-ghost p-2">
            <House size={28} />
            Home
        </a>
      <a class="btn btn-ghost p-2" href="/games">
        <Gamepad size={28} />
        Games
      </a>
    </div>
  {/if}
</nav>