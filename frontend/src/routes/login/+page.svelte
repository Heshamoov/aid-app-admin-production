<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { authStore, login, pb } from '$lib/api';
	import { t } from 'svelte-i18n';

	let email = '';
	let password = '';
	let errorMessage = '';
	let isLoading = false;

	// Check if user is already logged in
	onMount(() => {
		if (pb.authStore.isValid && pb.authStore.model) {
			// User is already logged in, redirect to dashboard
			const redirect = $page.url.searchParams.get('redirect') || '/dashboard';
			goto(redirect);
		}
	});

	async function handleLogin() {
		isLoading = true;
		errorMessage = '';
		const { success } = await login(email, password);

		if (success) {
			// Get redirect URL from query params or default to dashboard
			const redirect = $page.url.searchParams.get('redirect') || '/dashboard';
			goto(redirect);
		} else {
			errorMessage = $t('login_failed_message');
		}
		isLoading = false;
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
	<div class="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
		<div>
			<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
				{$t('sign_in_to_account')}
			</h2>
		</div>
		<form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
			<div class="space-y-4 rounded-md shadow-sm">
				<div>
					<label for="email-address" class="sr-only">{$t('email_address')}</label>
					<input
						id="email-address"
						name="email"
						type="email"
						autocomplete="email"
						required
						bind:value={email}
						class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
						placeholder={$t('email_address')}
					/>
				</div>
				<div>
					<label for="password" class="sr-only">{$t('password')}</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						bind:value={password}
						class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
						placeholder={$t('password')}
					/>
				</div>
			</div>

			{#if errorMessage}
				<p class="text-sm text-red-600">{errorMessage}</p>
			{/if}

			<div>
				<button
					type="submit"
					disabled={isLoading}
					class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
				>
					{#if isLoading}
						{$t('signing_in')}
					{:else}
						{$t('sign_in')}
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>

