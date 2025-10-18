<script lang="ts">
	import { pb } from '$lib/api';
	import { onMount } from 'svelte';

	let submissions: any[] = [];
	let isLoading = true;

	onMount(async () => {
		try {
			const result = await pb.collection('submissions').getFullList({
				sort: '-created',
				expand: 'form,submittedBy'
			});

			submissions = result;
		} catch (error) {
			console.error('Error fetching submissions:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<h1 class="mb-6 text-3xl font-bold text-gray-900">Form Submissions</h1>

	{#if isLoading}
		<p class="text-gray-500">Loading submissions...</p>
	{:else if submissions.length === 0}
		<p class="text-gray-500">No data has been submitted yet.</p>
	{:else}
		<div class="overflow-hidden rounded-lg bg-white shadow">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>#</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Form Name</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Submitted By</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Date</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each submissions as submission, i (submission.id)}
						<tr>
							<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{i + 1}</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
								<a href={`/dashboard/submissions/${submission.id}`}>{submission.expand?.form?.formName}</a>
							</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
								{submission.expand?.submittedBy?.name || 'N/A'}
							</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
								{new Date(submission.created).toLocaleString()}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
