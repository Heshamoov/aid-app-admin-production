<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/api';

	let updateAvailable = false;
	let currentVersion = '';
	let latestVersion = '';
	let checking = false;
	let lastChecked = '';

	// Check for updates on mount and every hour
	onMount(() => {
		checkForUpdates();
		const interval = setInterval(checkForUpdates, 3600000); // Check every hour
		return () => clearInterval(interval);
	});

	async function checkForUpdates() {
		if (checking) return;
		
		checking = true;
		try {
			// Try to fetch version info from a local endpoint
			const response = await fetch('/api/version', { 
				method: 'GET',
				headers: { 'Cache-Control': 'no-cache' }
			});
			
			if (response.ok) {
				const data = await response.json();
				currentVersion = data.current || 'unknown';
				latestVersion = data.latest || 'unknown';
				updateAvailable = data.updateAvailable || false;
				lastChecked = new Date().toLocaleString();
			}
		} catch (error) {
			// Silently fail - update check is not critical
			console.debug('Update check failed:', error);
		} finally {
			checking = false;
		}
	}

	function dismissNotification() {
		updateAvailable = false;
		// Store dismissal in localStorage to avoid showing again for this version
		localStorage.setItem('dismissed_update_' + latestVersion, 'true');
	}

	// Check if this update notification was already dismissed
	$: if (latestVersion && localStorage.getItem('dismissed_update_' + latestVersion)) {
		updateAvailable = false;
	}
</script>

{#if updateAvailable}
	<div
		class="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg bg-blue-600 p-4 text-white shadow-lg"
		role="alert"
	>
		<div class="flex items-start">
			<div class="flex-shrink-0">
				<svg
					class="h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
			</div>
			<div class="ml-3 flex-1">
				<h3 class="text-sm font-medium">Update Available</h3>
				<p class="mt-1 text-sm opacity-90">
					A new version of the Aid Platform is available. The system will automatically update during
					the next scheduled maintenance window.
				</p>
				{#if currentVersion && latestVersion}
					<p class="mt-2 text-xs opacity-75">
						Current: {currentVersion} → Latest: {latestVersion}
					</p>
				{/if}
			</div>
			<button
				on:click={dismissNotification}
				class="ml-3 flex-shrink-0 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
			>
				<span class="sr-only">Dismiss</span>
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					></path>
				</svg>
			</button>
		</div>
	</div>
{/if}

<style>
	/* Animation for notification appearance */
	div[role='alert'] {
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}
</style>

