<script lang="ts">
	import { pb } from '$lib/api';
	import { onMount } from 'svelte';

	let forms: any[] = [];
	let newFormName = '';
	let newFormDescription = '';
	let selectedForm: any = null;
	let newQuestionText = '';
	let newQuestionType = 'Text';
	let choiceInputs: string[] = ['', ''];
	let newQuestionIsRequired = true;
	let showFormModal = false;
	let showQuestionModal = false;

	const questionTypes = [
		{ value: 'Text', label: 'Text Answer', icon: '📝', description: 'Short text response' },
		{ value: 'Number', label: 'Number', icon: '🔢', description: 'Numeric input' },
		{ value: 'Yes/No', label: 'Yes/No', icon: '✓✗', description: 'Boolean choice' },
		{ value: 'Single-Choice', label: 'Multiple Choice', icon: '⭕', description: 'Select one option' }
	];

	onMount(async () => {
		await fetchForms();
	});

	async function fetchForms() {
		try {
			const result = await pb.collection('forms').getFullList({
				sort: '-created'
			});
			forms = result;
		} catch (error) {
			console.error('Error fetching forms:', error);
		}
	}

	async function createForm() {
		if (!newFormName.trim()) return;
		try {
			await pb.collection('forms').create({
				formName: newFormName,
				description: newFormDescription,
				createdBy: pb.authStore.model?.id,
				isActive: true
			});
			newFormName = '';
			newFormDescription = '';
			showFormModal = false;
			await fetchForms();
		} catch (error) {
			console.error('Error creating form:', error);
		}
	}

	function addChoiceInput() {
		choiceInputs = [...choiceInputs, ''];
	}

	function removeChoiceInput(index: number) {
		if (choiceInputs.length > 2) {
			choiceInputs = choiceInputs.filter((_, i) => i !== index);
		}
	}

	async function addQuestion() {
		if (!selectedForm || !newQuestionText.trim()) return;

		let choices = null;
		if (newQuestionType === 'Single-Choice') {
			choices = choiceInputs.filter(c => c.trim() !== '');
			if (choices.length < 2) {
				alert('Please provide at least 2 choices for multiple choice questions');
				return;
			}
		}

		const data = {
			form: selectedForm.id,
			questionText: newQuestionText,
			questionType: newQuestionType,
			isRequired: newQuestionIsRequired,
			order: selectedForm.questions ? selectedForm.questions.length : 0,
			choices: choices
		};

		try {
			await pb.collection('questions').create(data);
			newQuestionText = '';
			newQuestionType = 'Text';
			choiceInputs = ['', ''];
			newQuestionIsRequired = true;
			showQuestionModal = false;
			await selectForm(selectedForm);
		} catch (error) {
			console.error('Error adding question:', error);
			alert('Error adding question. Please try again.');
		}
	}

	async function selectForm(form: any) {
		selectedForm = form;
		if (selectedForm) {
			try {
				const questionsList = await pb.collection('questions').getFullList({
					filter: `form = '${selectedForm.id}'`,
					sort: 'order'
				});
				selectedForm.questions = questionsList;
			} catch (error) {
				console.error('Error fetching questions for form:', error);
				selectedForm.questions = [];
			}
		}
	}

	async function deleteQuestion(questionId: string) {
		if (!confirm('Are you sure you want to delete this question?')) return;
		try {
			await pb.collection('questions').delete(questionId);
			await selectForm(selectedForm);
		} catch (error) {
			console.error('Error deleting question:', error);
		}
	}

	function openQuestionModal() {
		newQuestionText = '';
		newQuestionType = 'Text';
		choiceInputs = ['', ''];
		newQuestionIsRequired = true;
		showQuestionModal = true;
	}

	function getQuestionTypeInfo(type: string) {
		return questionTypes.find(t => t.value === type) || questionTypes[0];
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Form Builder</h1>
			<p class="mt-2 text-sm text-gray-600">Create and manage custom forms for data collection</p>
		</div>
		<button
			on:click={() => showFormModal = true}
			class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
			</svg>
			New Form
		</button>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Forms List -->
		<div class="lg:col-span-1">
			<div class="bg-white rounded-lg shadow-sm border border-gray-200">
				<div class="p-4 border-b border-gray-200">
					<h2 class="text-lg font-semibold text-gray-900">Your Forms</h2>
					<p class="text-sm text-gray-500 mt-1">{forms.length} form{forms.length !== 1 ? 's' : ''}</p>
				</div>
				<div class="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
					{#if forms.length === 0}
						<div class="p-8 text-center">
							<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
							</svg>
							<p class="mt-2 text-sm text-gray-500">No forms yet</p>
						</div>
					{:else}
						{#each forms as form (form.id)}
							<button
								on:click={() => selectForm(form)}
								class="w-full text-left p-4 hover:bg-gray-50 transition-colors {selectedForm?.id === form.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}"
							>
								<h3 class="font-medium text-gray-900 {selectedForm?.id === form.id ? 'text-indigo-900' : ''}">{form.formName}</h3>
								{#if form.description}
									<p class="text-sm text-gray-500 mt-1 line-clamp-2">{form.description}</p>
								{/if}
								<p class="text-xs text-gray-400 mt-2">Created {new Date(form.created).toLocaleDateString()}</p>
							</button>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		<!-- Form Questions -->
		<div class="lg:col-span-2">
			{#if selectedForm}
				<div class="bg-white rounded-lg shadow-sm border border-gray-200">
					<div class="p-6 border-b border-gray-200">
						<div class="flex items-start justify-between">
							<div>
								<h2 class="text-2xl font-bold text-gray-900">{selectedForm.formName}</h2>
								{#if selectedForm.description}
									<p class="text-sm text-gray-600 mt-1">{selectedForm.description}</p>
								{/if}
								<p class="text-sm text-gray-500 mt-2">
									{selectedForm.questions?.length || 0} question{selectedForm.questions?.length !== 1 ? 's' : ''}
								</p>
							</div>
							<button
								on:click={openQuestionModal}
								class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
								</svg>
								Add Question
							</button>
						</div>
					</div>

					<div class="p-6">
						{#if selectedForm.questions && selectedForm.questions.length > 0}
							<div class="space-y-4">
								{#each selectedForm.questions as question, index (question.id)}
									<div class="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors bg-gray-50">
										<div class="flex items-start justify-between">
											<div class="flex-1">
												<div class="flex items-center gap-2 mb-2">
													<span class="text-lg">{getQuestionTypeInfo(question.questionType).icon}</span>
													<span class="text-xs font-medium text-gray-500 uppercase">{question.questionType}</span>
													{#if question.isRequired}
														<span class="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium">Required</span>
													{/if}
												</div>
												<h3 class="text-lg font-medium text-gray-900 mb-3">
													{index + 1}. {question.questionText}
												</h3>
												{#if question.questionType === 'Single-Choice' && question.choices}
													<div class="ml-4 space-y-2">
														{#each question.choices as choice}
															<div class="flex items-center gap-2 text-sm text-gray-600">
																<div class="w-4 h-4 rounded-full border-2 border-gray-400"></div>
																{choice}
															</div>
														{/each}
													</div>
												{/if}
											</div>
											<button
												on:click={() => deleteQuestion(question.id)}
												class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
												title="Delete question"
											>
												<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
												</svg>
											</button>
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<div class="text-center py-12">
								<svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
								</svg>
								<h3 class="mt-4 text-lg font-medium text-gray-900">No questions yet</h3>
								<p class="mt-2 text-sm text-gray-500">Get started by adding your first question</p>
								<button
									on:click={openQuestionModal}
									class="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
									</svg>
									Add First Question
								</button>
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
					<svg class="mx-auto h-20 w-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
					</svg>
					<h3 class="mt-4 text-lg font-medium text-gray-900">Select a form</h3>
					<p class="mt-2 text-sm text-gray-500">Choose a form from the list to view and edit questions</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Create Form Modal -->
{#if showFormModal}
	<div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" on:click={() => showFormModal = false}></div>
			<div class="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle z-50">
				<div class="bg-white px-6 pb-4 pt-5 sm:p-6 sm:pb-4">
					<h3 class="text-xl font-semibold text-gray-900 mb-6">Create New Form</h3>
					<div class="space-y-4">
						<div>
							<label for="formName" class="block text-sm font-medium text-gray-700 mb-2">Form Name *</label>
							<input
								type="text"
								id="formName"
								bind:value={newFormName}
								placeholder="e.g., Volunteer Application"
								class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2.5 border"
							/>
						</div>
						<div>
							<label for="formDescription" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
							<textarea
								id="formDescription"
								bind:value={newFormDescription}
								rows="3"
								placeholder="Brief description of this form's purpose"
								class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2.5 border"
							></textarea>
						</div>
					</div>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
					<button
						type="button"
						on:click={createForm}
						disabled={!newFormName.trim()}
						class="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Create Form
					</button>
					<button
						type="button"
						on:click={() => showFormModal = false}
						class="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Add Question Modal -->
{#if showQuestionModal}
	<div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" on:click={() => showQuestionModal = false}></div>
			<div class="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle z-50">
				<div class="bg-white px-6 pb-4 pt-5 sm:p-6 sm:pb-4">
					<h3 class="text-xl font-semibold text-gray-900 mb-6">Add New Question</h3>
					<div class="space-y-5">
						<!-- Question Text -->
						<div>
							<label for="questionText" class="block text-sm font-medium text-gray-700 mb-2">Question *</label>
							<input
								type="text"
								id="questionText"
								bind:value={newQuestionText}
								placeholder="e.g., What is your full name?"
								class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2.5 border text-base"
							/>
						</div>

						<!-- Question Type -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-3">Question Type *</label>
							<div class="grid grid-cols-2 gap-3">
								{#each questionTypes as type}
									<button
										type="button"
										on:click={() => newQuestionType = type.value}
										class="relative flex items-start p-4 border-2 rounded-lg transition-all {newQuestionType === type.value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300 bg-white'}"
									>
										<div class="flex-1 text-left">
											<div class="flex items-center gap-2 mb-1">
												<span class="text-2xl">{type.icon}</span>
												<span class="font-medium text-gray-900 text-sm">{type.label}</span>
											</div>
											<p class="text-xs text-gray-500">{type.description}</p>
										</div>
										{#if newQuestionType === type.value}
											<svg class="h-5 w-5 text-indigo-600 absolute top-2 right-2" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
											</svg>
										{/if}
									</button>
								{/each}
							</div>
						</div>

						<!-- Choices for Multiple Choice -->
						{#if newQuestionType === 'Single-Choice'}
							<div class="bg-gray-50 rounded-lg p-4">
								<label class="block text-sm font-medium text-gray-700 mb-3">Answer Choices *</label>
								<div class="space-y-2">
									{#each choiceInputs as choice, index}
										<div class="flex items-center gap-2">
											<div class="flex-1 flex items-center gap-2">
												<span class="text-gray-400 text-sm w-6">{index + 1}.</span>
												<input
													type="text"
													bind:value={choiceInputs[index]}
													placeholder="Enter choice"
													class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border text-sm"
												/>
											</div>
											{#if choiceInputs.length > 2}
												<button
													type="button"
													on:click={() => removeChoiceInput(index)}
													class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
												>
													<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
													</svg>
												</button>
											{/if}
										</div>
									{/each}
								</div>
								<button
									type="button"
									on:click={addChoiceInput}
									class="mt-3 inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
									</svg>
									Add Choice
								</button>
							</div>
						{/if}

						<!-- Required Checkbox -->
						<div class="flex items-center gap-2">
							<input
								id="isRequired"
								type="checkbox"
								bind:checked={newQuestionIsRequired}
								class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
							/>
							<label for="isRequired" class="text-sm font-medium text-gray-700">
								Make this question required
							</label>
						</div>
					</div>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
					<button
						type="button"
						on:click={addQuestion}
						disabled={!newQuestionText.trim()}
						class="inline-flex w-full justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Add Question
					</button>
					<button
						type="button"
						on:click={() => showQuestionModal = false}
						class="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

