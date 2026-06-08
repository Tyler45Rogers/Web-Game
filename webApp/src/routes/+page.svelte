<script>
    import MoveDown from '@lucide/svelte/icons/move-down';
    import LinkedIn from '@lucide/svelte/icons/user-round';
    import GitHub from '@lucide/svelte/icons/folder-git';
    import Email from '@lucide/svelte/icons/mail';
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import { projects } from '$lib/projects/projects.js';

</script>


<!--Who Am I-->
<section class="mt-10 w-4/5">
<div class="flex flex-col mx-auto gap-10">
    <p class="text-5xl md:text-9xl font-bold text-left justify-start animate-pulse bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent pb-8"> Tyler Rogers </p>
    <div class="flex flex-row justify-end">
        <p class="text-lg md:text-2xl font-bold max-w-md text-right"> I am a software engineer from Iowa with a foundation in web development, databases, multiple programming languages, and more. Below are some of my projects that I have made. </p>
    </div>

    <!--Links to GitHub, LinkedIn, Email-->
    <div class="grid grid-cols-3 justify-items-center">
        <div class="flex flex-col items-center gap-2">
            <GitHub size={32} class="text-gray-500 hover:text-gray-700 transition-colors duration-300 cursor-pointer md:hidden" onclick={() => window.open('https://github.com/Tyler45Rogers')} />
            <GitHub size={64} class="text-gray-500 hover:text-gray-700 transition-colors duration-300 cursor-pointer hidden md:block" onclick={() => window.open('https://github.com/Tyler45Rogers')} />
            <p class="text-sm md:text-base font-bold text-center">Github</p>
        </div>

        <div class="flex flex-col items-center gap-2">
            <LinkedIn size={32} class="text-gray-500 hover:text-gray-700 transition-colors duration-300 cursor-pointer md:hidden" onclick={() => window.open('https://www.linkedin.com/in/tyler45rogers/')} />
            <LinkedIn size={64} class="text-gray-500 hover:text-gray-700 transition-colors duration-300 cursor-pointer hidden md:block" onclick={() => window.open('https://www.linkedin.com/in/tyler45rogers/')} />
            <p class="text-sm md:text-base font-bold text-center">Linkedin</p>
        </div>

        <div class="flex flex-col items-center gap-2">
            <Email size={32} class="text-gray-500 hover:text-gray-700 transition-colors duration-300 cursor-pointer md:hidden" onclick={() => window.location.href = 'mailto:tyler45rogers@gmail.com'} />
            <Email size={64} class="text-gray-500 hover:text-gray-700 transition-colors duration-300 cursor-pointer hidden md:block" onclick={() => window.location.href = 'mailto:tyler45rogers@gmail.com'} />
            <p class="text-sm md:text-base font-bold text-center">Email</p>
        </div>
    </div>

    <div class ="flex justify-center">
        <MoveDown size={48} class="text-violet-500 animate-bounce md:hidden" />
        <MoveDown size={96} class="text-violet-500 animate-bounce hidden md:block" />
    </div>
    

</div>

<!--Projects-->
<p class="text-5xl md:text-9xl font-bold text-left justify-start animate-pulse bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent pb-8"> Projects </p>

    <div class="flex flex-col justify-items-center mx-auto">
        <div class = "grid md:grid-cols-3 sm:grid-cols-1 justify-items-center mx-auto mb-10 mt-10 gap-10">
            {#each projects as project}
            <ProjectCard
                title={project.title}
                description={project.description}
                details={project.details}
                screenshot={project.screenshot}
            />
            {/each}
        </div>

    </div>
</section>