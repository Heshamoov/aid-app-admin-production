<script lang="ts">
	import { pb } from '$lib/api';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let forms: any[] = [];
	let isLoading = true;

	onMount(async () => {
		try {
			// Fetch only active forms
			const result = await pb.collection('forms').getFullList({
				filter: 'isActive = true',
				sort: '-created'
			});
			forms = result;
		} catch (error) {
			console.error('Error fetching forms:', error);
		} finally {
			isLoading = false;
		}
	});

	function selectForm(formId: string) {
		// Navigate to a new page where the volunteer will fill out the selected form
		goto(`/volunteer/fill/${formId}`);
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<h1 class="mb-6 text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
	<p class="mb-8 text-lg text-gray-600">Please select a form to begin data collection.</p>

	{#if isLoading}
		<p class="text-gray-500">Loading available forms...</p>
	{:else if forms.length === 0}
		<div class="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
			<h3 class="mt-2 text-sm font-medium text-gray-900">No Active Forms</h3>
			<p class="mt-1 text-sm text-gray-500">
				An administrator has not created or activated any forms yet.
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each forms as form (form.id)}
				<div
					class="flex flex-col justify-between rounded-lg bg-white p-6 shadow transition-shadow duration-200 hover:shadow-lg"
				>
					<div>
						<h3 class="text-xl font-semibold text-gray-800">{form.formName}</h3>
						<p class="mt-2 text-base text-gray-600">{form.description || 'No description.'}</p>
					</div>
					<div class="mt-6">
						<button
							on:click={() => selectForm(form.id)}
							class="w-full rounded-md bg-indigo-600 px-4 py-2 text-center text-lg font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Start
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
