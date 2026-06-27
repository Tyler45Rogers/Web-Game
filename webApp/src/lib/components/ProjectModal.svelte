<script>
    let { title, details, screenshot, onclose } = $props();

    function handleBackdropClick(e) {
        if (e.target === e.currentTarget) onclose();
    }

    function handleKeydown(e) {
        if (e.key === 'Escape') onclose();
    }

    //Get the theme for background - nord or dark
    const activeTheme = document.documentElement.getAttribute('data-theme');
</script>

<dialog
    open
    class="fixed inset-0 z-50 flex items-center justify-center p-4 m-0 h-full w-full bg-black/50 border-none backdrop:bg-transparent"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    aria-label={title}
>
    {#if (activeTheme == 'dark')}
        <div class="bg-zinc-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 class="text-2xl font-bold">{title}</h2>
                <button
                    onclick={onclose}
                    class="hover: text-3xl leading-none"
                    aria-label="Close modal"
                >
                    &times;
                </button>
            </div>

            {#if screenshot}
                <img src={screenshot} alt="{title} screenshot" class="w-full object-cover" />
            {/if}

            <div class="p-6">
                <p class="leading-relaxed">{details}</p>
            </div>
        </div>  
    {:else}
          <div class="bg-secondary rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 class="text-2xl font-bold">{title}</h2>
                <button
                    onclick={onclose}
                    class="hover: text-3xl leading-none"
                    aria-label="Close modal"
                >
                    &times;
                </button>
            </div>

            {#if screenshot}
                <img src={screenshot} alt="{title} screenshot" class="w-full object-cover" />
            {/if}

            <div class="p-6">
                <p class="leading-relaxed">{details}</p>
            </div>
        </div> 
    {/if}

</dialog>