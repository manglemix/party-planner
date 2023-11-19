import { error, redirect } from '@sveltejs/kit';

// const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function load(event) {
	if (event.url.searchParams.get("reset")) {
		event.cookies.delete('sessionToken');
		throw redirect(307, "/");
	}
	let sessionToken = event.cookies.get('sessionToken');
	if (sessionToken === undefined) {
		sessionToken = crypto.randomUUID();
		event.cookies.set('sessionToken', sessionToken);
		// event.cookies.delete('locations');
	}

	// let bodyJson: Record<string, any> = {
	// 	userMessage: "",
	// 	sessionToken
	// };

	// let messages: string[] = [];
	// let response;
	// try {
	// 	response = await event.fetch('https://cb3d-35-3-152-108.ngrok-free.app/new-message/', {
	// 		method: 'post',
	// 		body: JSON.stringify(bodyJson)
	// 	});
	// } catch (error) {
	// 	console.log(error);
	// 	messages.push('I seemed to have faced an issue. Please try again later.');
	// 	return { errMsg: 'failed to fetch', messages };
	// }
	
	// const responseJson = await response.json();
	// messages.push(responseJson['msg']);

	return { sessionToken };
}

export const actions = {
	default: async (event) => {
		const sessionToken = event.cookies.get('sessionToken');
		if (sessionToken === undefined) {
			throw error(400, 'Invalid form');
		}
		const formData = await event.request.formData();
		const userMessage = formData.get('user-message')?.toString();
		if (userMessage === undefined) {
			throw error(400, 'Invalid form');
		}
		const messagesJson = formData.get('messages')?.toString();
		if (messagesJson === undefined) {
			throw error(400, 'Invalid form');
		}
		let messages: string[] = JSON.parse(messagesJson);
		messages.push(userMessage);

		let bodyJson: Record<string, any> = {
			userMessage,
			sessionToken
		};

		const lat = formData.get('lat')?.toString() ?? '';
		const lng = formData.get('lng')?.toString() ?? '';
		event.cookies.set('lat', lat);
		event.cookies.set('lng', lng);

		if (lat !== '') {
			bodyJson['lat'] = lat;
		}
		if (lng !== '') {
			bodyJson['lng'] = lng;
		}

		let response;
		try {
			response = await event.fetch('https://cb3d-35-3-152-108.ngrok-free.app/new-message/', {
				method: 'post',
				body: JSON.stringify(bodyJson)
			});
		} catch (error) {
			console.log(error);
			messages.push('I seemed to have faced an issue. Please try again later.');
			return { errMsg: 'failed to fetch', messages };
		}

		const responseJson = await response.json();

		if (responseJson["msg"]) {
			messages.push(responseJson['msg']);
		}

		return {
			messages,
			done: responseJson["done"] ?? false
		};
	}
};
