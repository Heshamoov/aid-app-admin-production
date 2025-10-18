<script lang="ts">
  import { authStore, logout, pb } from '$lib/api';
  import { goto } from '$app/navigation';
  import { t, locale } from 'svelte-i18n';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';

  function handleLogout() {
    logout();
    goto('/login');
  }

  function switchTo(lang: 'en' | 'ar') {
    locale.set(lang);
    if (browser) localStorage.setItem('lang', lang);
  }

  $: current = $locale === 'ar' ? 'ar' : 'en';
  $: isOnDashboard = $page.url.pathname === '/dashboard';
  // Use the authStore Svelte store instead of pb.authStore directly for reactivity
  $: isAuthenticated = $authStore.user !== null;
</script>

<nav class="bg-white shadow-md">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <!-- Left: Brand + Dashboard button -->
      <div class="flex items-center gap-4">
        <p class="text-lg font-bold text-indigo-600">{$t('title')}</p>
        
        {#if isAuthenticated && !isOnDashboard}
          <a
            href="/dashboard"
            class="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            {$t('dashboard')}
          </a>
        {:else if isAuthenticated && isOnDashboard}
          <h1 class="text-xl font-semibold">{$t('welcome-message')}</h1>
        {/if}
      </div>

      <!-- Right: Lang switcher + user -->
      <div class="flex items-center gap-4">
        <!-- Language Switcher (compact pill) -->
        <div
          class="inline-flex rounded-full border bg-white p-1 shadow-sm"
          role="group"
        >
          <button
            on:click={() => switchTo('en')}
            class="rounded-full px-3 py-1 text-sm font-medium transition-colors {current ===
            'en'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'}"
          >
            {$t('english')}
          </button>
          <button
            on:click={() => switchTo('ar')}
            class="rounded-full px-3 py-1 text-sm font-medium transition-colors {current ===
            'ar'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'}"
          >
            {$t('arabic')}
          </button>
        </div>

        <!-- User menu (only show if authenticated) -->
        {#if isAuthenticated}
          <button
            on:click={handleLogout}
            class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            {$t('logout')}
          </button>
        {/if}
      </div>
    </div>
  </div>
</nav>

