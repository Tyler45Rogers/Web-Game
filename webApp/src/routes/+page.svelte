<script>
    import MoveDown from '@lucide/svelte/icons/move-down';
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import { projects } from '$lib/projects/projects.js';
</script>


<!--Who Am I-->
<section class="mt-10">
<div class="flex flex-col mx-auto gap-10">
    <p class="text-9xl font-bold text-left justify-start animate-pulse bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent pb-8"> Tyler Rogers </p>
    <div class="flex flex-row justify-end">
        <p class="text-2xl font-bold mt-10 mr-10 max-w-md text-right"> I am a software engineer from Iowa with a foundation in web development, databases, multiple programming languages, and more. Below are some of my projects that I have made. </p>
    </div>
    <div class ="flex justify-center">
        <MoveDown size={48} class="flex justify-center"/>
    </div>
    

</div>

<!--Projects-->
<p class="text-9xl font-bold text-left justify-start animate-pulse bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent pb-8"> Projects </p>

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