// src/routes/+layout.ts
import '$lib/i18n';
import { waitLocale } from 'svelte-i18n';

export const load = async () => {
  // Ensures the initial locale is set and its messages are loaded
  await waitLocale();
  return {};
};
