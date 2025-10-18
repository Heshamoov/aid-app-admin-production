<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { pb } from '$lib/api';

	let isOnline = writable(navigator.onLine);
	let lastSyncTime = writable<Date | null>(null);
	let syncInProgress = writable(false);
	let showIndicator = writable(true);
	let checkInterval: number;

	onMount(() => {
		// Load last sync time from localStorage
		const stored = localStorage.getItem('lastSyncTime');
		if (stored) {
			lastSyncTime.set(new Date(stored));
		}

		// Update online status
		const updateOnlineStatus = () => {
			const online = navigator.onLine;
			isOnline.set(online);
			
			if (online) {
				// Attempt to sync when coming online
				performSync();
			}
		};

		// Check connection periodically
		checkInterval = window.setInterval(() => {
			// Ping the backend to verify real connectivity
			checkBackendConnection();
		}, 30000); // Check every 30 seconds

		window.addEventListener('online', updateOnlineStatus);
		window.addEventListener('offline', updateOnlineStatus);

		// Initial connection check
		checkBackendConnection();

		return () => {
			window.removeEventListener('online', updateOnlineStatus);
			window.removeEventListener('offline', updateOnlineStatus);
			if (checkInterval) clearInterval(checkInterval);
		};
	});

	async function checkBackendConnection() {
		try {
			const response = await fetch('http://127.0.0.1:8090/api/health', {
				method: 'GET',
				signal: AbortSignal.timeout(5000) // 5 second timeout
			});
			
			if (response.ok) {
				isOnline.set(true);
				// If we were offline and now online, trigger sync
				if (!$isOnline) {
					performSync();
				}
			} else {
				isOnline.set(false);
			}
		} catch (error) {
			// Backend not reachable
			isOnline.set(false);
		}
	}

	async function performSync() {
		if ($syncInProgress) return;
		
		syncInProgress.set(true);
		try {
			// Check if authenticated
			if (pb.authStore.isValid) {
				// Trigger a simple query to verify connection
				await pb.collection('users').getList(1, 1);
				
				// Update last sync time
				const now = new Date();
				lastSyncTime.set(now);
				localStorage.setItem('lastSyncTime', now.toISOString());
			}
		} catch (error) {
			console.debug('Sync check failed:', error);
		} finally {
			syncInProgress.set(false);
		}
	}

	function formatLastSync(date: Date | null): string {
		if (!date) return 'Never';
		const now = new Date();
		const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

		if (diff < 60) return 'Just now';
		if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
		if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
		return `${Math.floor(diff / 86400)}d ago`;
	}

	function toggleIndicator() {
		showIndicator.update(v => !v);
	}

	// Auto-hide when online for more than 5 minutes
	$: if ($isOnline && $lastSyncTime) {
		const diff = new Date().getTime() - $lastSyncTime.getTime();
		if (diff > 300000) { // 5 minutes
			// Keep showing but make it less prominent
		}
	}
</script>

{#if $showIndicator}
	<div class="fixed bottom-4 left-4 z-40">
		{#if !$isOnline}
			<!-- Offline Indicator -->
			<div
				class="flex items-center gap-3 rounded-lg bg-yellow-50 px-4 py-3 shadow-lg ring-1 ring-yellow-200 transition-all hover:shadow-xl"
				role="status"
				aria-live="polite"
			>
				<div class="flex h-3 w-3">
					<span
						class="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-yellow-400 opacity-75"
					></span>
					<span class="relative inline-flex h-3 w-3 rounded-full bg-yellow-500"></span>
				</div>
				<div class="text-sm">
					<p class="font-semibold text-yellow-900">Offline Mode</p>
					<p class="text-xs text-yellow-700">Working offline • Data saved locally</p>
					{#if $lastSyncTime}
						<p class="text-xs text-yellow-600 mt-0.5">
							Last sync: {formatLastSync($lastSyncTime)}
						</p>
					{/if}
				</div>
				<button
					on:click={toggleIndicator}
					class="ml-2 text-yellow-600 hover:text-yellow-800"
					aria-label="Hide indicator"
				>
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						></path>
					</svg>
				</button>
			</div>
		{:else}
			<!-- Online Indicator (subtle) -->
			<div
				class="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 shadow-md ring-1 ring-green-200 transition-all hover:shadow-lg"
				role="status"
				aria-live="polite"
			>
				<div class="flex items-center gap-2">
					{#if $syncInProgress}
						<svg
							class="h-3 w-3 animate-spin text-green-600"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					{:else}
						<div class="h-2 w-2 rounded-full bg-green-500"></div>
					{/if}
					<div class="text-xs">
						<span class="font-medium text-green-800">Online</span>
						{#if $lastSyncTime}
							<span class="text-green-600 ml-1">• {formatLastSync($lastSyncTime)}</span>
						{/if}
					</div>
				</div>
				<button
					on:click={toggleIndicator}
					class="ml-1 text-green-600 hover:text-green-800"
					aria-label="Hide indicator"
				>
					<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						></path>
					</svg>
				</button>
			</div>
		{/if}
	</div>
{:else}
	<!-- Show/restore button when hidden -->
	<button
		on:click={toggleIndicator}
		class="fixed bottom-4 left-4 z-40 rounded-full bg-gray-200 p-2 shadow-md hover:bg-gray-300"
		aria-label="Show connection status"
		title="Show connection status"
	>
		{#if $isOnline}
			<div class="h-2 w-2 rounded-full bg-green-500"></div>
		{:else}
			<div class="h-2 w-2 rounded-full bg-yellow-500"></div>
		{/if}
	</button>
{/if}

<style>
	/* Smooth animations */
	div[role='status'] {
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			transform: translateX(-100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}
</style>

