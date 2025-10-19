// src/lib/api.ts
import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
import type { Admin, Record } from 'pocketbase';
import { env } from '$env/dynamic/public'; // ← build-safe

// Prefer cloud if set; else same-origin (PocketBase serving pb_public)
const base =
  env.PUBLIC_PB_URL ??
  (typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1:8090');

export const pb = new PocketBase(base);

// Auth store
export const authStore = writable<{ user: Record | Admin | null }>({ user: pb.authStore.model });

export async function login(email: string, password: string) {
  try {
    await pb.collection('users').authWithPassword(email, password);
    authStore.set({ user: pb.authStore.model });
    return { success: true };
  } catch (error: any) {
    console.error('Login failed:', error);
    return { success: false, error: error.message };
  }
}

export function logout() {
  pb.authStore.clear();
  authStore.set({ user: null });
}

pb.authStore.onChange((_token, model) => {
  authStore.set({ user: model });
});

// @ts-ignore – tiny helper for synchronous read
authStore.get = () => {
  let value;
  const un = authStore.subscribe((v) => (value = v));
  un();
  return value;
};
