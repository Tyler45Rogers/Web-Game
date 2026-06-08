<script>
    import ProjectModal from './ProjectModal.svelte';

    let { title, description, details, screenshot } = $props();
    let viewProject = $state(false);
</script>

<div class="bg-neutral-primary-soft block w-3/4 p-6 border border-default rounded-base shadow-xs">
    <h5 class="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">{title}</h5>
    <p class="text-body mb-6">{description}</p>
    <button
        class="btn btn-primary border-2 border-gray-300 font-bold text-2xl rounded-full"
        onclick={() => viewProject = true}
    >
        View Project
    </button>
</div>

{#if viewProject}
    <ProjectModal
        {title}
        {details}
        {screenshot}
        onclose={() => viewProject = false}
    />
{/if}