<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { pb } from '$lib/api';

	let submission: any = null;
	let answers: any[] = [];
	let loading = true;
	let error = '';

	onMount(async () => {
		const id = $page.params.id; // route param

		try {
			submission = await pb.collection('submissions').getOne(id, {
				expand: 'form,submittedBy'
			});

			answers = await pb.collection('answers').getFullList({
				filter: `submission="${id}"`,
				expand: 'question',
				sort: 'created'
			});
		} catch (e: any) {
			console.error(e);
			error = e?.message ?? 'Failed to load';
		} finally {
			loading = false;
		}
	});
</script>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<h1 class="mb-6 text-3xl font-bold text-gray-900">Submission</h1>
	{#if loading}
		<p class="text-gray-500">Loading submissions...</p>
	{:else if submission.length === 0}
		<p class="text-gray-500">No data has been submitted yet.</p>
	{:else}
		<h2>{submission.expand?.form?.formName}</h2>
		<div>
			By: {submission.expand?.submittedBy?.name} on {new Date(submission.created).toLocaleString()}
		</div>
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
							>Question</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Answer</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each answers as a, i}
						<tr>
							<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{i + 1}</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
								{a.expand?.question?.questionText}
							</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
								{a.answerValue}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
