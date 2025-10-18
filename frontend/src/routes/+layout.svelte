<script lang="ts">
	import '$lib/i18n';
	import '../app.css';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	import Navbar from '$lib/components/Navbar.svelte';
	import UpdateNotification from '$lib/components/UpdateNotification.svelte';
	import OfflineIndicator from '$lib/components/OfflineIndicator.svelte';

	// keep <html> dir/lang in sync with current locale
	import { locale } from 'svelte-i18n';
	import { browser } from '$app/environment';

	$: if (browser) {
		document.documentElement.setAttribute('dir', $locale === 'ar' ? 'rtl' : 'ltr');
		document.documentElement.setAttribute('lang', $locale);
	}
</script>

<div class="min-h-screen bg-gray-100">
	<Navbar />
	<main>
		<slot />
	</main>
	<UpdateNotification />
	<OfflineIndicator />
</div>

