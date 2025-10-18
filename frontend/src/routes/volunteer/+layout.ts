// src/routes/volunteer/+layout.ts
import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/api';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
	// Check if user is authenticated
	if (!pb.authStore.isValid || !pb.authStore.model) {
		// Redirect to login page if not authenticated
		throw redirect(303, `/login?redirect=${encodeURIComponent(url.pathname)}`);
	}

	// Check if user has volunteer role
	const user = pb.authStore.model;
	if (user.role !== 'volunteer') {
		// Redirect to appropriate page based on role
		if (user.role === 'admin' || user.role === 'monitor') {
			throw redirect(303, '/dashboard');
		} else {
			throw redirect(303, '/login');
		}
	}

	// Return user data if authenticated and authorized
	return {
		user: pb.authStore.model
	};
};

