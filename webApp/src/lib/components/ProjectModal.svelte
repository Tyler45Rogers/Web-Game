<script>
    let { title, details, screenshot, onclose } = $props();

    function handleBackdropClick(e) {
        if (e.target === e.currentTarget) onclose();
    }

    function handleKeydown(e) {
        if (e.key === 'Escape') onclose();
    }
</script>

<dialog
    open
    class="fixed inset-0 z-50 flex items-center justify-center p-4 m-0 h-full w-full bg-black/50 border-none backdrop:bg-transparent"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    aria-label={title}
>
    <div class="bg-secondary [[data-theme=dark]_&]:bg-zinc-800 rounded-xl shadow-xl w-full max-w-2xl h-2/3 flex flex-col overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
            <h2 class="text-2xl font-bold">{title}</h2>
            <button onclick={onclose} class="text-3xl leading-none" aria-label="Close modal">
                &times;
            </button>
        </div>
        {#if screenshot}
            <div class="flex items-center justify-center bg-black/10 h-64 shrink-0">
                <img src={screenshot} alt="{title} screenshot" class="max-h-full max-w-full object-contain" />
            </div>
        {/if}
        <div class="p-6 overflow-y-auto">
            <p class="leading-relaxed">{details}</p>
        </div>
    </div>
</dialog>
