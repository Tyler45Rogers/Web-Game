<script>
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import { projects } from '$lib/projects/projects.js';
</script>

<section>

    <div class="flex flex-col justify-items-center mx-auto">
        <p class="text-5xl font-bold mt-10 text-center"> Projects </p>
    

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