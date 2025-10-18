// src/lib/api.ts
import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
import type { Admin, Record  } from 'pocketbase';
import { PUBLIC_PB_URL } from '$env/static/public';

// Point this to the URL of your running PocketBase instance
// export const pb = new PocketBase('http://127.0.0.1:8090' );

// Online production
export const pb = new PocketBase(PUBLIC_PB_URL);


// Create a writable Svelte store to hold the auth state
// We type it to accept a User, Admin, or null model
export const authStore = writable<{ user: Record | Admin | null }>({ 
	user: pb.authStore.model
});

// Function to handle user login
export async function login(email, password) {
	try {
		await pb.collection('users').authWithPassword(email, password);
		
		// Update the store on successful login
		authStore.set({
			user: pb.authStore.model
		});
		return { success: true };
	} catch (error) {
		console.error('Login failed:', error);
		return { success: false, error: error.message };
	}
}

// Function to handle user logout
export function logout() {
	pb.authStore.clear();
	// Update the store on logout (setting user to null)
	authStore.set({ user: null });
}

// Subscribe to authStore changes and update PocketBase's store
// This keeps the SDK in sync if the auth state changes elsewhere
pb.authStore.onChange((token, model) => {
	console.log('Auth store changed', model);
	authStore.set({ user: model });
});


// @ts-ignore
authStore.get = () => {
	let value;
	const unsubscribe = authStore.subscribe((v) => (value = v));
	unsubscribe();
	return value;
};
