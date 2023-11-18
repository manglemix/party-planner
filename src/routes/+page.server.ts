import { error } from '@sveltejs/kit';


const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


export async function load({ cookies }) {
	let sessionToken = cookies.get("sessionToken");
    if (sessionToken === undefined) {
        sessionToken = crypto.randomUUID();
        cookies.set("sessionToken", sessionToken);
    }
}


export const actions = {
	default: async (event) => {
		const sessionToken = event.cookies.get("sessionToken");
        if (sessionToken === undefined) {
            throw error(400, "Invalid form");
        }
        const formData = await event.request.formData();
        const userMessage = formData.get("user-message")?.toString();
        if (userMessage === undefined) {
            throw error(400, "Invalid form");
        }
        const messagesJson = formData.get("messages")?.toString();
        if (messagesJson === undefined) {
            throw error(400, "Invalid form");
        }
        let messages: string[] = JSON.parse(messagesJson);
        messages.push(userMessage);

        let bodyJson: Record<string, any> = {
            userMessage,
            sessionToken
        };

        const lat = formData.get("lat")?.toString() ?? "";
        const lng = formData.get("lng")?.toString() ?? "";

        if (lat !== "") {
            bodyJson["lat"] = lat;
        }
        if (lng !== "") {
            bodyJson["lng"] = lng;
        }

        const body = JSON.stringify(bodyJson);

        // let response;
        // try {
        //     response = await event.fetch("http://127.0.0.1:8000/new-message", { method: "post", body });
        // } catch (error) {
        //     console.log(messages);
        //     return { errMsg: "failed to fetch", messages };
        // }

        await delay(3000);
        messages.push("lmao");
        return {
            messages
        };
	}
};