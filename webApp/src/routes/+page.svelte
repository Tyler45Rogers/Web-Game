<script>
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import { projects } from '$lib/projects/projects.js';
</script>

<section>

    <div class="flex flex-col justify-items-center mx-auto">
        <p class="text-5xl font-bold mt-20"> Projects </p>
    </div>

    <div class = "flex flex-grid justify-items-center mx-auto mb-10 mt-10 gap-10">
        {#each projects as project}
        <ProjectCard
            title={project.title}
            description={project.description}
            details={project.details}
            screenshot={project.screenshot}
        />
        {/each}
    </div>
</section>