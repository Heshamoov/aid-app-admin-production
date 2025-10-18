<script lang="ts">
	import { pb } from '$lib/api';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let form: any = null;
	let questions: any[] = [];
	let answers: { [key: string]: any } = {};
	let isLoading = true;
	let isSubmitting = false;
	let submissionComplete = false; // <-- NEW STATE VARIABLE

	onMount(async () => {
		const formId = $page.params.formId;
		try {
			const formPromise = pb.collection('forms').getOne(formId);
			const questionsPromise = pb.collection('questions').getFullList({
				filter: `form = '${formId}'`,
				sort: 'order'
			});
			[form, questions] = await Promise.all([formPromise, questionsPromise]);
			questions.forEach((q) => {
				answers[q.id] = q.questionType === 'Yes/No' ? false : '';
			});
		} catch (error) {
			console.error('Error loading form:', error);
		} finally {
			isLoading = false;
		}
	});

	// In frontend/src/routes/volunteer/fill/[formId]/+page.svelte

	// In frontend/src/routes/volunteer/fill/[formId]/+page.svelte

	async function handleSubmit() {
		console.log('--- Start handleSubmit (for loop version) ---');
		isSubmitting = true;

		try {
			console.log('Step 1: Creating submission record...');
			const submissionRecord = await pb.collection('submissions').create({
				form: form.id,
				submittedBy: pb.authStore.model?.id
			});
			console.log('Step 1 SUCCESS: Submission record created with ID:', submissionRecord.id);

			console.log('Step 2: Preparing to create answer records one by one...');

			// THIS IS THE KEY CHANGE: We use a simple for...of loop instead of Promise.all
			for (const [questionId, answerValue] of Object.entries(answers)) {
				console.log(`Saving answer for question ${questionId}...`);
				await pb.collection('answers').create({
					submission: submissionRecord.id,
					question: questionId,
					answerValue: JSON.stringify(answerValue)
				});
				console.log(`SUCCESS for question ${questionId}`);
			}

			console.log('Step 2 SUCCESS: All answers saved.');

			// If the loop completes without error, we know everything is saved.
			submissionComplete = true;
		} catch (error) {
			console.error('--- ERROR in handleSubmit ---');
			console.error('The error occurred during the save process:', error);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
	{#if isLoading}
		<p class="text-center text-lg text-gray-600">Loading form...</p>
	{:else if !form}
		<p class="text-center text-lg text-red-600">Could not load the form. Please go back.</p>

		<!-- THIS IS THE NEW PART: Success Message UI -->
	{:else if submissionComplete}
		<div class="rounded-lg bg-green-50 p-8 text-center shadow-lg">
			<h2 class="text-2xl font-bold text-green-800">Submission Successful!</h2>
			<p class="mt-4 text-lg text-green-700">The data has been saved correctly.</p>
			<button
				on:click={() => goto('/volunteer')}
				class="mt-6 inline-flex items-center rounded-md bg-green-600 px-6 py-3 text-lg font-medium text-white shadow-sm hover:bg-green-700"
			>
				Back to Dashboard
			</button>
		</div>

		<!-- This is the original form UI -->
	{:else}
		<h1 class="mb-2 text-3xl font-bold text-gray-900">{form.formName}</h1>
		<p class="mb-8 text-lg text-gray-600">{form.description}</p>

		<div class="space-y-6">
			{#each questions as question (question.id)}
				<div class="rounded-md bg-white p-4 shadow-sm">
					<label class="block text-lg font-medium text-gray-800">
						{question.questionText}
						{#if question.isRequired}
							<span class="text-red-500">*</span>
						{/if}
					</label>

					{#if question.questionType === 'Text'}
						<input
							type="text"
							bind:value={answers[question.id]}
							required={question.isRequired}
							class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						/>
					{:else if question.questionType === 'Number'}
						<input
							type="number"
							bind:value={answers[question.id]}
							required={question.isRequired}
							class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						/>
					{:else if question.questionType === 'Yes/No'}
						<div class="mt-2 flex items-center">
							<input
								type="checkbox"
								bind:checked={answers[question.id]}
								class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
							/>
							<span class="ml-2 text-gray-700">Yes</span>
						</div>
					{:else if question.questionType === 'Single-Choice'}
						<select
							bind:value={answers[question.id]}
							required={question.isRequired}
							class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						>
							<option value="" disabled>Select an option</option>
							{#each question.choices as choice}
								<option value={choice}>{choice}</option>
							{/each}
						</select>
					{/if}
				</div>
			{/each}

			<div class="pt-4">
				<div class="flex items-center justify-between gap-4">
					<a
						href="/volunteer"
						class="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-center text-lg font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						Back to Dashboard
					</a>
					<button
						type="button"
						on:click={handleSubmit}
						disabled={isSubmitting}
						class="flex-1 rounded-md bg-green-600 px-4 py-3 text-center text-lg font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
					>
						{isSubmitting ? 'Submitting...' : 'Submit Form'}
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
