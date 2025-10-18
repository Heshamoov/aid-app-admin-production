<script lang="ts">
	import { pb } from '$lib/api';
	import { onMount } from 'svelte';
	import { t, locale } from 'svelte-i18n';

	let submissionCount = 0;
	let formCount = 0;

	// Financial data
	let totalIncome = 0;
	let totalExpenses = 0;
	let currentBalance = 0;
	let recentTransactions = [];
	const flags: Record<string, string> = {
		SYP: '🇸🇾',
		USD: '🇺🇸',
		EUR: '🇪🇺',
		AED: '🇦🇪',
		GBP: '🇬🇧',
		SAR: '🇸🇦'
	};

	const dn = {
		ar: new Intl.DisplayNames(['ar-AE', 'ar'], { type: 'currency' }),
		en: new Intl.DisplayNames(['en-US', 'en'], { type: 'currency' })
	};
	function cname(code: string) {
		return (isAr() ? dn.ar : dn.en).of(code) ?? code;
	}

	const sortByAmountDesc = (a, b) => b.amount - a.amount;

	function isAr() {
		return $locale?.startsWith('ar');
	}
	// 1) Format plain numbers with Arabic digits when Arabic is active
	function num(n: number) {
		return new Intl.NumberFormat(isAr() ? 'ar-AE' : 'en-US', {
			maximumFractionDigits: 0,
			numberingSystem: isAr() ? 'arab' : undefined
		}).format(n);
	}

	// 2) Format money by currency with Arabic layout/symbol when Arabic is active
	function money(amount: number, currency: string) {
		return new Intl.NumberFormat(isAr() ? 'ar-AE' : 'en-US', {
			style: 'currency',
			currency,
			maximumFractionDigits: 2,
			numberingSystem: isAr() ? 'arab' : undefined,
			currencyDisplay: 'symbol'
		}).format(amount);
	}

	onMount(async () => {
		// Fetch the total number of form records
		try {
			const formResult = await pb.collection('forms').getList(1, 1, {
				fields: 'id'
			});
			formCount = formResult.totalItems;
		} catch (error) {
			console.error('Error fetching forms:', error);
			formCount = 0;
		}

		// Fetch the total number of submission records
		try {
			const submissionResult = await pb.collection('submissions').getList(1, 1, {
				fields: 'id'
			});
			submissionCount = submissionResult.totalItems;
		} catch (error) {
			console.error('Error fetching submissions:', error);
			submissionCount = 0;
		}

		// Fetch financial data
		await fetchFinancialData();
	});

	let incomeBreakdown: { currency: string; amount: number }[] = [];
	let expenseBreakdown: { currency: string; amount: number }[] = [];
	let balanceBreakdown: { currency: string; amount: number }[] = [];
	async function fetchFinancialData() {
		try {
			// Fetch all donations
			const donationsResult = await pb.collection('donations').getFullList({
				fields: 'amount,currency'
			});

			// Group by currency
			const incomeMap: Record<string, number> = {};
			for (const d of donationsResult) {
				incomeMap[d.currency] = (incomeMap[d.currency] || 0) + d.amount;
			}
			incomeBreakdown = Object.entries(incomeMap).map(([currency, amount]) => ({
				currency,
				amount
			}));

			totalIncome = Object.values(incomeMap).reduce((a, b) => a + b, 0);

			// Expenses
			const expensesResult = await pb.collection('expenses').getFullList({
				filter: 'status = "Approved"',
				fields: 'amount,currency'
			});

			const expenseMap: Record<string, number> = {};
			for (const e of expensesResult) {
				expenseMap[e.currency] = (expenseMap[e.currency] || 0) + e.amount;
			}
			expenseBreakdown = Object.entries(expenseMap).map(([currency, amount]) => ({
				currency,
				amount
			}));
			totalExpenses = Object.values(expenseMap).reduce((a, b) => a + b, 0);

			// Current Balance per currency
			const allCurrencies = new Set([...Object.keys(incomeMap), ...Object.keys(expenseMap)]);
			balanceBreakdown = Array.from(allCurrencies).map((currency) => ({
				currency,
				amount: (incomeMap[currency] || 0) - (expenseMap[currency] || 0)
			}));

			currentBalance = totalIncome - totalExpenses;

			// Fetch recent transactions (last 5 donations and expenses)
			const recentDonations = await pb.collection('donations').getList(1, 3);
			console.log('recentDonations sample:', recentDonations.items[0]);

			const recentExpenses = await pb.collection('expenses').getList(1, 3);

			// Combine and sort recent transactions
			recentTransactions = [
				...recentDonations.items.map((d) => ({
					type: 'donation',
					description: `Donation from ${d.donor_name}`,
					amount: d.amount,
					currency: d.currency,
					date: d.created
				})),
				...recentExpenses.items.map((e) => ({
					type: 'expense',
					description: e.description,
					amount: e.amount,
					currency: e.currency,
					date: e.created,
					category: e.category
				}))
			]
				.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
				.slice(0, 5);
		} catch (error) {
			console.error('Error fetching financial data:', error);
			// Set default values if collections don't exist yet
			totalIncome = totalExpenses = currentBalance = 0;
			incomeBreakdown = expenseBreakdown = balanceBreakdown = [];
			recentTransactions = [];
		}
	}
</script>

<div class="py-10">
	<header>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">
				{$t('dashboard')}
			</h1>
		</div>
	</header>
	<main>
		<div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
			<div class="px-4 py-8 sm:px-0">
				<!-- Financial Summary Section -->
				<div class="mb-8">
					<h2 class="mb-4 text-xl font-semibold text-gray-900">{$t('financial_overview')}</h2>
					<div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
						<!-- Income by Currency -->
						<div class="overflow-hidden rounded-2xl bg-green-50 shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-green-100/70">
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
												<ul
													class="mt-3 divide-y divide-green-100 rounded-lg bg-white/60 backdrop-blur"
												>
													{#each incomeBreakdown.slice().sort(sortByAmountDesc) as item}
														<li class="flex items-center justify-between gap-2 px-3 py-2 text-sm transition-all duration-300 hover:bg-white/80 hover:scale-[1.02] rounded-md">
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
											</dd>
										</dl>
									</div>
								</div>
							</div>
						</div>

						<!-- Expenses by Currency -->
						<div class="overflow-hidden rounded-2xl bg-red-50 shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-red-100/70">
							<div class="p-5">
								<div class="flex items-center">
									<svg
										class="h-8 w-8 text-red-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
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
											<ul class="mt-3 divide-y divide-red-100 rounded-lg bg-white/60 backdrop-blur">
												{#each expenseBreakdown.slice().sort(sortByAmountDesc) as item}
													<li class="flex items-center justify-between gap-2 px-3 py-2 text-sm transition-all duration-300 hover:bg-white/80 hover:scale-[1.02] rounded-md">
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
										</dd>
									</div>
								</div>
							</div>
						</div>

						<!-- Balance by Currency -->
						<div class="overflow-hidden rounded-2xl bg-blue-50 shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-blue-100/70">
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
											<ul
												class="mt-3 divide-y divide-blue-100 rounded-lg bg-white/60 backdrop-blur"
											>
												{#each balanceBreakdown.slice().sort(sortByAmountDesc) as item}
													<li class="flex items-center justify-between gap-2 px-3 py-2 text-sm transition-all duration-300 hover:bg-white/80 hover:scale-[1.02] rounded-md">
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
										</dd>
									</div>
								</div>
							</div>
						</div>

						<!-- Financial Management Button -->
						<div class="mt-4">
							<a
								href="/dashboard/finances"
								class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							>
								<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
									></path>
								</svg>
								{$t('manage_finances')}
							</a>
						</div>
					</div>

					<!-- Key Metric Cards -->
					<div class="mb-8">
						<h2 class="mb-4 text-xl font-semibold text-gray-900">{$t('operations_overview')}</h2>
						<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
							<!-- Total Forms Card -->
							<div class="overflow-hidden rounded-lg bg-white shadow">
								<div class="p-5">
									<div class="flex items-center">
										<div class="ml-5 w-0 flex-1">
											<dl>
												<dt class="truncate text-sm font-medium text-gray-500">
													{$t('total_forms_created')}
												</dt>
												<dd>
													<div class="text-3xl font-bold text-gray-900">{formCount}</div>
												</dd>
											</dl>
										</div>
									</div>
								</div>
							</div>

							<!-- Total Submissions Card -->
							<div class="overflow-hidden rounded-lg bg-white shadow">
								<div class="p-5">
									<div class="flex items-center">
										<div class="ml-5 w-0 flex-1">
											<dl>
												<dt class="truncate text-sm font-medium text-gray-500">
													{$t('total_submissions')}
												</dt>
												<dd>
													<div class="text-3xl font-bold text-gray-900">{submissionCount}</div>
												</dd>
											</dl>
										</div>
									</div>
								</div>
							</div>

							<!-- Add this new card for viewing submissions -->
							<div class="overflow-hidden rounded-lg bg-white shadow">
								<div class="p-5">
									<div class="flex items-center">
										<div class="ml-5 w-0 flex-1">
											<dl>
												<dt class="truncate text-sm font-medium text-gray-500">
													{$t('view_data')}
												</dt>
												<dd>
													<a
														href="/dashboard/submissions"
														class="text-3xl font-bold text-teal-600 hover:text-teal-700"
													>
														{$t('view_submissions')}
													</a>
												</dd>
											</dl>
										</div>
									</div>
								</div>
							</div>

							<!-- Inside the grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 div -->
							<!-- Add this new card -->
							<div class="overflow-hidden rounded-lg bg-white shadow">
								<div class="p-5">
									<div class="flex items-center">
										<div class="ml-5 w-0 flex-1">
											<dl>
												<dt class="truncate text-sm font-medium text-gray-500">
													{$t('form_builder')}
												</dt>
												<dd>
													<a
														href="/dashboard/forms"
														class="text-3xl font-bold text-indigo-600 hover:text-indigo-700"
													>
														{$t('manage_forms')}
													</a>
												</dd>
											</dl>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>
