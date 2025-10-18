// src/hooks.server.ts
import PocketBase from 'pocketbase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const pb = new PocketBase(import.meta.env.PUBLIC_PB_URL);

	// Load auth from cookie
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		if (pb.authStore.isValid) {
			await pb.collection('users').authRefresh();
		}
	} catch {
		pb.authStore.clear();
	}

	event.locals.pb = pb;
	event.locals.user = pb.authStore.model;

	const response = await resolve(event);

	// Save updated auth to cookie
	response.headers.set(
		'set-cookie',
		pb.authStore.exportToCookie({ httpOnly: true, sameSite: 'Lax', secure: false })
	);

	return response;
};
