// src/lib/i18n.ts
import { register, init, getLocaleFromNavigator } from 'svelte-i18n';
import { browser } from '$app/environment';

// Register your locales
register('en', () => import('../locales/en.json'));
register('ar', () => import('../locales/ar.json'));

// Decide the initial locale
let initialLocale = 'en';

if (browser) {
  const saved = localStorage.getItem('lang');
  if (saved) {
    initialLocale = saved;
  } else {
    const nav = getLocaleFromNavigator();
    initialLocale = nav?.startsWith('ar') ? 'ar' : 'en';
  }
}

// Initialize i18n
init({
  fallbackLocale: 'en',
  initialLocale
});
