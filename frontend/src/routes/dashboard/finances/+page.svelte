<script lang="ts">
	import { pb } from '$lib/api';
	import { onMount } from 'svelte';
	import { t, locale } from 'svelte-i18n';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	function isAr() {
		return $locale?.startsWith('ar');
	}

	const flags: Record<string, string> = {
		SYP: '🇸🇾',
		USD: '🇺🇸',
		EUR: '🇪🇺',
		AED: '🇦🇪',
		SAR: '🇸🇦'
	};

	const sortByAmountDesc = (a, b) => b.amount - a.amount;

	const dn = {
		ar: new Intl.DisplayNames(['ar-AE', 'ar'], { type: 'currency' }),
		en: new Intl.DisplayNames(['en-US', 'en'], { type: 'currency' })
	};
	const cname = (code: string) => (isAr() ? dn.ar : dn.en).of(code) ?? code;

	function money(amount: number, currency: string) {
		return new Intl.NumberFormat(isAr() ? 'ar-AE' : 'en-US', {
			style: 'currency',
			currency,
			maximumFractionDigits: 2,
			numberingSystem: isAr() ? 'arab' : undefined
		}).format(amount);
	}

	// Data variables
	let donations = [];
	let expenses = [];
	let totalIncome = 0;
	let totalExpenses = 0;
	let currentBalance = 0;
	let loading = true;

	// Form variables for new donation
	let showDonationForm = false;
	let newDonation = {
		donor_name: '',
		transaction_date: new Date().toISOString().split('T')[0],
		donor_organization: '',
		amount: 0,
		currency: 'SYP',
		payment_method: 'Cash',
		purpose: '',
		receipt_number: '',
		donor_contact: '',
		notes: ''
	};

	// Form variables for new expense
	let showExpenseForm = false;
	let newExpense = {
		category: 'Medical Supplies',
		transaction_date: new Date().toISOString().split('T')[0],
		amount: 0,
		currency: 'SYP',
		vendor_supplier: '',
		receipt_invoice_number: '',
		project_campaign: '',
		description: '',
		status: 'Pending'
	};

	// Filter and pagination
	let currentTab = 'overview'; // overview, donations, expenses
	let searchTerm = '';
	let selectedCurrency = 'all';

	onMount(async () => {
		await fetchFinancialData();
		loading = false;
		
		// Check URL parameters for auto-opening forms
		const action = $page.url.searchParams.get('action');
		if (action === 'add-donation') {
			showDonationForm = true;
			goto('/dashboard/finances', { replaceState: true });
		} else if (action === 'add-expense') {
			showExpenseForm = true;
			goto('/dashboard/finances', { replaceState: true });
		}
	});

	let incomeBreakdown: { currency: string; amount: number }[] = [];
	let expenseBreakdown: { currency: string; amount: number }[] = [];
	let balanceBreakdown: { currency: string; amount: number }[] = [];

	async function fetchFinancialData() {
		try {
			// Fetch donations
			const donationsResult = await pb.collection('donations').getFullList(20);
			donations = donationsResult;

			// Fetch expenses
			const expensesResult = await pb.collection('expenses').getFullList(20);
			expenses = expensesResult;

			const incomeMap: Record<string, number> = {};
			for (const d of donations) incomeMap[d.currency] = (incomeMap[d.currency] || 0) + d.amount;
			incomeBreakdown = Object.entries(incomeMap).map(([currency, amount]) => ({
				currency,
				amount
			}));

			const expenseMap: Record<string, number> = {};
			for (const e of expenses.filter((e) => e.status === 'Approved'))
				expenseMap[e.currency] = (expenseMap[e.currency] || 0) + e.amount;
			expenseBreakdown = Object.entries(expenseMap).map(([currency, amount]) => ({
				currency,
				amount
			}));

			const all = new Set([...Object.keys(incomeMap), ...Object.keys(expenseMap)]);
			balanceBreakdown = Array.from(all).map((c) => ({
				currency: c,
				amount: (incomeMap[c] || 0) - (expenseMap[c] || 0)
			}));

			// Calculate totals
			totalIncome = donations.reduce((sum, donation) => sum + donation.amount, 0);
			totalExpenses = expenses
				.filter((expense) => expense.status === 'Approved')
				.reduce((sum, expense) => sum + expense.amount, 0);
			currentBalance = totalIncome - totalExpenses;
		} catch (error) {
			console.error('Error fetching financial data:', error);
		}
	}

	async function addDonation() {
		try {
			await pb.collection('donations').create({
				...newDonation,
				recorded_by: pb.authStore.model?.id,
				approved_by: pb.authStore.model?.id
			});

			// Reset form
			newDonation = {
				donor_name: '',
				transaction_date: new Date().toISOString().split('T')[0],
				donor_organization: '',
				amount: 0,
				currency: 'SYP',
				payment_method: 'Cash',
				purpose: '',
				receipt_number: '',
				donor_contact: '',
				notes: ''
			};
			showDonationForm = false;
			await fetchFinancialData();
		} catch (error) {
			console.error('Error adding donation:', error);
			alert('Error adding donation: ' + error.message);
		}
	}

	async function addExpense() {
		try {
			await pb.collection('expenses').create({
				...newExpense,
				recorded_by: pb.authStore.model?.id,
				approved_by: pb.authStore.model?.id
			});

			// Reset form
			newExpense = {
				category: 'Medical Supplies',
				transaction_date: new Date().toISOString().split('T')[0],
				amount: 0,
				currency: 'SYP',
				vendor_supplier: '',
				receipt_invoice_number: '',
				project_campaign: '',
				description: '',
				status: 'Pending'
			};
			showExpenseForm = false;
			await fetchFinancialData();
		} catch (error) {
			console.error('Error adding expense:', error);
			alert('Error adding expense: ' + error.message);
		}
	}

	async function updateExpenseStatus(expenseId: string, newStatus: string) {
		try {
			await pb.collection('expenses').update(expenseId, {
				status: newStatus,
				approved_by: pb.authStore.model?.id
			});
			await fetchFinancialData();
		} catch (error) {
			console.error('Error updating expense status:', error);
		}
	}

	function formatDate(dateString: string) {
		if (!dateString || dateString === "") return "-";
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return "-";
		return date.toLocaleDateString();
	}

	function formatCurrency(amount: number, currency: string = 'USD') {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency
		}).format(amount);
	}

	// Filter functions
	$: filteredDonations = donations.filter(
		(donation) =>
			(selectedCurrency === 'all' || donation.currency === selectedCurrency) &&
			(searchTerm === '' ||
				donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				donation.purpose.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	$: filteredExpenses = expenses.filter(
		(expense) =>
			(selectedCurrency === 'all' || expense.currency === selectedCurrency) &&
			(searchTerm === '' ||
				expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				expense.category.toLowerCase().includes(searchTerm.toLowerCase()))
	);
</script>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<h1 class="mb-6 text-3xl font-bold text-gray-900">Financial Management</h1>

	{#if loading}
		<div class="flex justify-center py-12">
			<div class="text-lg text-gray-600">Loading financial data...</div>
		</div>
	{:else}
		<!-- Financial Summary Cards -->
		<div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
			<!-- Income by Currency -->
			<div
				class="overflow-hidden rounded-2xl bg-green-50 shadow transition-all duration-300 hover:-translate-y-1 hover:bg-green-100/70 hover:shadow-lg"
			>
				<div class="p-5">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<svg
								class="h-8 w-8 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>

						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="truncate text-sm font-medium text-gray-600">
									{$t('income_by_currency')}
								</dt>
								<dd>
									{#key $locale}
										<ul class="mt-3 divide-y divide-green-100 rounded-lg bg-white/60 backdrop-blur">
											{#each incomeBreakdown.slice().sort(sortByAmountDesc) as item}
												<li
													class="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/80"
												>
													<!-- Arabic/English currency name -->
													<div class="flex items-center gap-2">
														<span class="text-gray-700">{cname(item.currency)}</span>
													</div>

													<!-- Amount aligned left for Arabic layout -->
													<div
														class="font-semibold tabular-nums {item.amount >= 0
															? 'text-green-900'
															: 'text-red-700'} w-32 text-left ltr:text-right rtl:text-left"
													>
														{money(item.amount, item.currency)}
													</div>
												</li>
											{/each}
										</ul>
									{/key}
								</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>

			<!-- Expenses by Currency -->
			<div
				class="overflow-hidden rounded-2xl bg-red-50 shadow transition-all duration-300 hover:-translate-y-1 hover:bg-red-100/70 hover:shadow-lg"
			>
				<div class="p-5">
					<div class="flex items-center">
						<svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
							/>
						</svg>

						<div class="ml-5 w-0 flex-1">
							<dt class="truncate text-sm font-medium text-gray-600">
								{$t('expenses_by_currency')}
							</dt>
							<dd>
								{#key $locale}
									<ul class="mt-3 divide-y divide-red-100 rounded-lg bg-white/60 backdrop-blur">
										{#each expenseBreakdown.slice().sort(sortByAmountDesc) as item}
											<li
												class="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/80"
											>
												<!-- Arabic/English currency name -->
												<div class="flex items-center gap-2">
													<span class="text-gray-700">{cname(item.currency)}</span>
												</div>

												<!-- Amount aligned left for Arabic layout -->
												<div
													class="font-semibold tabular-nums {item.amount >= 0
														? 'text-green-900'
														: 'text-red-700'} w-32 text-left ltr:text-right rtl:text-left"
												>
													{money(item.amount, item.currency)}
												</div>
											</li>
										{/each}
									</ul>
								{/key}
							</dd>
						</div>
					</div>
				</div>
			</div>

			<!-- Balance by Currency -->
			<div
				class="overflow-hidden rounded-2xl bg-blue-50 shadow transition-all duration-300 hover:-translate-y-1 hover:bg-blue-100/70 hover:shadow-lg"
			>
				<div class="p-5">
					<div class="flex items-center">
						<svg
							class="h-8 w-8 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zM9 19V9a2 2 0 012-2h2a2 2 0 012 2v10"
							/>
						</svg>

						<div class="ml-5 w-0 flex-1">
							<dt class="truncate text-sm font-medium text-gray-600">
								{$t('balance_by_currency')}
							</dt>
							<dd>
								{#key $locale}
									<ul class="mt-3 divide-y divide-blue-100 rounded-lg bg-white/60 backdrop-blur">
										{#each balanceBreakdown.slice().sort(sortByAmountDesc) as item}
											<li
												class="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/80"
											>
												<!-- Arabic/English currency name -->
												<div class="flex items-center gap-2">
													<span class="text-gray-700">{cname(item.currency)}</span>
												</div>

												<!-- Amount aligned left for Arabic layout -->
												<div
													class="font-semibold tabular-nums {item.amount >= 0
														? 'text-green-900'
														: 'text-red-700'} w-32 text-left ltr:text-right rtl:text-left"
												>
													{money(item.amount, item.currency)}
												</div>
											</li>
										{/each}
									</ul>
								{/key}
							</dd>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="mb-6 flex flex-wrap gap-4">
			<button
				on:click={() => (showDonationForm = !showDonationForm)}
				class="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
			>
				<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					></path>
				</svg>
				Add Donation
			</button>

			<button
				on:click={() => (showExpenseForm = !showExpenseForm)}
				class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
			>
				<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					></path>
				</svg>
				Add Expense
			</button>
		</div>

		<!-- Add Donation Form -->
		{#if showDonationForm}
			<div class="mb-8 rounded-lg bg-green-50 p-6 shadow">
				<h3 class="mb-4 text-lg font-semibold text-gray-900">Add New Donation</h3>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label class="block text-sm font-medium text-gray-700">Donor Name *</label>
						<input
							type="text"
							bind:value={newDonation.donor_name}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
							required
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Organization</label>
						<input
							type="text"
							bind:value={newDonation.donor_organization}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Transaction Date *</label>
						<input
							type="date"
							bind:value={newDonation.transaction_date}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
							required
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Amount *</label>
						<input
							type="number"
							bind:value={newDonation.amount}
							min="0"
							step="0.01"
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
							required
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Currency</label>
						<select
							bind:value={newDonation.currency}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
						>
							<option value="SYP">SYP</option>
							<option value="USD">USD</option>
							<option value="EUR">EUR</option>
							<option value="SAR">SAR</option>
							<option value="AED">AED</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Payment Method</label>
						<select
							bind:value={newDonation.payment_method}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
						>
							<option value="Cash">Cash</option>
							<option value="Bank Transfer">Bank Transfer</option>
							<option value="Check">Check</option>
							<option value="Other">Other</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Purpose/Campaign</label>
						<input
							type="text"
							bind:value={newDonation.purpose}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Receipt Number</label>
						<input
							type="text"
							bind:value={newDonation.receipt_number}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Contact Information</label>
						<input
							type="text"
							bind:value={newDonation.donor_contact}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
						/>
					</div>
					<div class="sm:col-span-2">
						<label class="block text-sm font-medium text-gray-700">Notes</label>
						<textarea
							bind:value={newDonation.notes}
							rows="3"
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
						></textarea>
					</div>
				</div>
				<div class="mt-4 flex gap-2">
					<button
						on:click={addDonation}
						class="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
					>
						Save Donation
					</button>
					<button
						on:click={() => (showDonationForm = false)}
						class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						Cancel
					</button>
				</div>
			</div>
		{/if}

		<!-- Add Expense Form -->
		{#if showExpenseForm}
			<div class="mb-8 rounded-lg bg-red-50 p-6 shadow">
				<h3 class="mb-4 text-lg font-semibold text-gray-900">Add New Expense</h3>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label class="block text-sm font-medium text-gray-700">Category *</label>
						<select
							bind:value={newExpense.category}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
						>
							<option value="Medical Supplies">Medical Supplies</option>
							<option value="Food & Water">Food & Water</option>
							<option value="Transportation">Transportation</option>
							<option value="Shelter Materials">Shelter Materials</option>
							<option value="Clothing">Clothing</option>
							<option value="Equipment">Equipment</option>
							<option value="Administrative">Administrative</option>
							<option value="Communication">Communication</option>
							<option value="Fuel">Fuel</option>
							<option value="Emergency Response">Emergency Response</option>
							<option value="Education Materials">Education Materials</option>
							<option value="Other">Other</option>
						</select>
					</div>
					<div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Transaction Date *</label>
						<input
							type="date"
							bind:value={newExpense.transaction_date}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
							required
						/>
					</div>
						<label class="block text-sm font-medium text-gray-700">Amount *</label>
						<input
							type="number"
							bind:value={newExpense.amount}
							min="0"
							step="0.01"
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
							required
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Currency</label>
						<select
							bind:value={newExpense.currency}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
						>
							<option value="SYP">SYP</option>
							<option value="USD">USD</option>
							<option value="EUR">EUR</option>
							<option value="SAR">SAR</option>
							<option value="AED">AED</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Vendor/Supplier</label>
						<input
							type="text"
							bind:value={newExpense.vendor_supplier}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Receipt/Invoice Number</label>
						<input
							type="text"
							bind:value={newExpense.receipt_invoice_number}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Project/Campaign</label>
						<input
							type="text"
							bind:value={newExpense.project_campaign}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
						/>
					</div>
					<div class="sm:col-span-2">
						<label class="block text-sm font-medium text-gray-700">Description *</label>
						<textarea
							bind:value={newExpense.description}
							rows="3"
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
							required
						></textarea>
					</div>
				</div>
				<div class="mt-4 flex gap-2">
					<button
						on:click={addExpense}
						class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
					>
						Save Expense
					</button>
					<button
						on:click={() => (showExpenseForm = false)}
						class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						Cancel
					</button>
				</div>
			</div>
		{/if}

		<!-- Tabs Navigation -->
		<div class="mb-6">
			<nav class="flex space-x-8" aria-label="Tabs">
				<button
					on:click={() => (currentTab = 'donations')}
					class="whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium {currentTab ===
					'donations'
						? 'border-green-500 text-green-600'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
				>
					Donations ({donations.length})
				</button>
				<button
					on:click={() => (currentTab = 'expenses')}
					class="whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium {currentTab ===
					'expenses'
						? 'border-red-500 text-red-600'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
				>
					Expenses ({expenses.length})
				</button>
			</nav>
		</div>

		<!-- Search and Filter -->
		<div class="mb-6 flex flex-wrap gap-4">
			<div class="min-w-64 flex-1">
				<input
					type="text"
					bind:value={searchTerm}
					placeholder="Search transactions..."
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				/>
			</div>
			<div>
				<select
					bind:value={selectedCurrency}
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				>
					<option value="all">All Currencies</option>
					<option value="SYP">SYP</option>
					<option value="USD">USD</option>
					<option value="EUR">EUR</option>
					<option value="SAR">SAR</option>
					<option value="AED">AED</option>
				</select>
			</div>
		</div>

		<!-- Donations Table -->
		{#if currentTab === 'donations'}
			<div class="overflow-x-auto overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
				<table class="min-w-full divide-y divide-gray-300">
					<thead class="bg-gray-50">
						<tr>
							<th
								class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
								>Donor</th
							>
							<th
								class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
								>Organization</th
							>
							<th
								class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
								>Amount</th
							>
							<th
								class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
								>Method</th
							>
							<th
								class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
								>Purpose</th
							>
							<th
								class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
								>Receipt #</th
							>
							<th
								class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
								>Contact</th
							>
							<th
								class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
								>Date</th
							>
							<th
								class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
								>Notes</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white">
						{#each filteredDonations as donation (donation.id)}
							<tr>
								<td class="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
									<div class="font-medium">{donation.donor_name}</div>
								</td>
								<td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
									{donation.donor_organization || '-'}
								</td>
								<td class="whitespace-nowrap px-4 py-4 text-sm">
									<span
										class="block font-medium tabular-nums text-green-600 ltr:text-right rtl:text-left"
									>
										{money(donation.amount, donation.currency)}
									</span>
								</td>
								<td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500"
									>{donation.payment_method}</td
								>
								<td class="px-4 py-4 text-sm text-gray-500">{donation.purpose || '-'}</td>
								<td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
									{donation.receipt_number || '-'}
								</td>
								<td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
									{donation.donor_contact || '-'}
								</td>
								<td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500"
									>{formatDate(donation.transaction_date || donation.created)}</td
								>
								<td class="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
									{donation.notes || '-'}
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="9" class="px-6 py-4 text-center text-sm text-gray-500"
									>No donations found</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Expenses Table -->
		{#if currentTab === 'expenses'}
			<div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
				<table class="min-w-full divide-y divide-gray-300">
					<thead class="bg-gray-50">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
								>Description</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
								>Category</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
								>Amount</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
								>Status</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
								>Date</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
								>Actions</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white">
						{#each filteredExpenses as expense (expense.id)}
							<tr>
								<td class="px-6 py-4 text-sm text-gray-900">
									<div class="font-medium">{expense.description}</div>
									{#if expense.vendor_supplier}
										<div class="text-gray-500">Vendor: {expense.vendor_supplier}</div>
									{/if}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{expense.category}</td
								>
								<td class="whitespace-nowrap px-6 py-4 text-sm">
									<span
										class="block font-medium tabular-nums text-red-600 ltr:text-right rtl:text-left"
									>
										{money(expense.amount, expense.currency)}
									</span>
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm">
									<span
										class="inline-flex rounded-full px-2 text-xs font-semibold leading-5 {expense.status ===
										'Approved'
											? 'bg-green-100 text-green-800'
											: expense.status === 'Rejected'
												? 'bg-red-100 text-red-800'
												: 'bg-yellow-100 text-yellow-800'}"
									>
										{expense.status}
									</span>
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
									>{formatDate(expense.transaction_date || expense.created)}</td
								>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
									{#if expense.status === 'Pending'}
										<div class="flex gap-2">
											<button
												on:click={() => updateExpenseStatus(expense.id, 'Approved')}
												class="text-green-600 hover:text-green-900"
											>
												Approve
											</button>
											<button
												on:click={() => updateExpenseStatus(expense.id, 'Rejected')}
												class="text-red-600 hover:text-red-900"
											>
												Reject
											</button>
										</div>
									{:else}
										-
									{/if}
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500"
									>No expenses found</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	{/if}
</div>
