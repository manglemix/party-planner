import { redirect } from '@sveltejs/kit';

export async function load(event) {
	let sessionToken = event.cookies.get('sessionToken');
	if (sessionToken === undefined) {
		throw redirect(307, '/');
	}
	return {
		sessionToken
	};
}
