<script>
    import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
    
</script>

<nav class="w-full border-b-2 border-gray-300 justify-items-center">

    <div class ="flex flex-row justify-around justify-items-center content-center mt-5 mb-5">

        <!-- Left -->
        <div class="flex items-center justify-left ml-20">
            <a class="btn btn-primary border-2 border-gray-300 font-bold text-2xl rounded-full" href="/">Home</a>
        </div>
        

        <!-- Center -->
        <div class="flex flex-row justify-center items-center mr-20">
            <a class="btn btn-primary border-2 border-gray-300 font-bold text-2xl rounded-full" href="/games">Games</a>
        </div>

        <!-- Right -->
        <div class="sm:mr-2 md:mr-5">
            <ThemeSwitcher />
        </div>

    </div>
    
</nav>


