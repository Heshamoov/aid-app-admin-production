// src/routes/dashboard/+layout.ts
import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/api';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
	// Check if user is authenticated
	if (!pb.authStore.isValid || !pb.authStore.model) {
		// Redirect to login page if not authenticated
		throw redirect(303, `/login?redirect=${encodeURIComponent(url.pathname)}`);
	}

	// Return user data if authenticated
	return {
		user: pb.authStore.model
	};
};

