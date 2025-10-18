<script lang="ts">
	import { pb } from '$lib/api';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		// Check if user is authenticated
		if (pb.authStore.isValid && pb.authStore.model) {
			const user = pb.authStore.model;
			console.log('User found, redirecting based on role:', user.role);
			
			// Redirect based on role
			const role = user.role;
			if (role === 'admin' || role === 'monitor') {
				goto('/dashboard', { replaceState: true });
			} else if (role === 'volunteer') {
				goto('/volunteer', { replaceState: true });
			} else {
				// Fallback for users with no role
				goto('/login', { replaceState: true });
			}
		} else {
			// User is not logged in, send to login page
			console.log('No user found, redirecting to /login');
			goto('/login', { replaceState: true });
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="text-center">
		<div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
		<p class="mt-4 text-lg text-gray-600">Loading...</p>
	</div>
</div>

