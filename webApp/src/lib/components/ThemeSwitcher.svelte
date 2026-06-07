<script>
    import { onMount } from 'svelte';
    import Sun from '@lucide/svelte/icons/sun';
    import Moon from '@lucide/svelte/icons/moon';

    let currentTheme = $state('dark'); // ✅ IMPORTANT

    onMount(() => {
        currentTheme = localStorage.getItem('theme') || 'dark';
    });

    $effect(() => {
        document.documentElement.setAttribute('data-theme', currentTheme);
    });

    const switchTheme = () => {
        currentTheme = currentTheme === 'dark' ? 'nord' : 'dark';
        localStorage.setItem('theme', currentTheme);
    };
</script>

<button onclick={switchTheme} class="btn btn-soft bg-transparent border-none hover:bg-base-200/30">
    {#if currentTheme === 'dark'}
        <Sun />
    {:else}
        <Moon />
    {/if}
</button>