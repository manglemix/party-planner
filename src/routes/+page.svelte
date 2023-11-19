<script lang="ts">
	import { browser } from '$app/environment';
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import chatbg from '$lib/assets/chat-background.png';
	import send from '$lib/assets/send.png';
	import loadingMsg from '$lib/assets/loading-msg.gif';
	import { scale, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	const scrollOptions: ScrollToOptions = { top: 100000000, behavior: 'smooth' };

	export let data;
	export let form;
	let placeholder = 'Type here';
	let messages: string[] = [];
	$: {
		if (form) {
			if (form.done) {
				goto("/plan");
			} else {
				messages = form.messages;
			}
		// } else if (data.messages) {
		// 	messages = data.messages;
		}
		if (chatboxMessages) {
			delay(100).then(() => {
				chatboxMessages.scrollTo(scrollOptions);
			});
		}
	}
	let waitingForAI = false;
	let messagesJson = JSON.stringify(messages);
	$: messagesJson = JSON.stringify(messages);

	if (browser && messages.length == 0) {
		waitingForAI = true;
		fetch('https://cb3d-35-3-152-108.ngrok-free.app/new-message/', {
				method: 'post',
				body: JSON.stringify({
					userMessage: "",
					sessionToken: data.sessionToken
				})
			}).then(async (response) => {
				const responseJson = await response.json();
				messages.push(responseJson['msg']);
				messages = messages;
				waitingForAI = false;
			})
			.catch((e) => {
				console.log(e);
				messages.push('I seemed to have faced an issue. Please try again later.');
				messages = messages;
				waitingForAI = false;
			});
	}

	let currentMessage = '';

	let lat = 42.2808;
	let lng = -83.743;

	if (browser) {
		if (navigator?.geolocation) {
			navigator.permissions.query({ name: 'geolocation' }).then((result) => {
				if (result.state === 'granted' || result.state === 'prompt') {
					navigator.geolocation.getCurrentPosition((position) => {
						lat = position.coords.latitude;
						lng = position.coords.longitude;
					});
				}
				// Don't do anything if the permission was denied.
			});
		}
	}

	const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

	let chatboxMessages: HTMLElement;
	const scaleTransition = { duration: 400, delay: 0, opacity: 1, start: 0, easing: quintOut };
</script>

<div class="page" transition:fade|global={{ duration: 700 }}>
	<h1>Party Planner</h1>
	<h2>Create a complete plan, fit for any time, with just a simple conversation!</h2>

	<section id="chatbox">
		<div id="chatbox-messages" bind:this={chatboxMessages}>
			<img src={chatbg} alt="chat background" />
			{#each messages as message, i}
				{#if i % 2 == 0}
					<div class="ai-msg">
						<p transition:scale|global={scaleTransition}>{message}</p>
					</div>
				{:else}
					<div class="user-msg">
						<p transition:scale|global={scaleTransition}>{message}</p>
					</div>
				{/if}
			{/each}
			{#if waitingForAI && !form?.done}
				{#await delay(1000) then}
					<div class="ai-msg">
						<div transition:scale={scaleTransition}>
							<img src={loadingMsg} alt="loading message" />
						</div>
					</div>
				{/await}
			{/if}
			<!-- {#if form?.done}
				<div class="ai-msg">
					<p transition:scale|global={scaleTransition}>I would love to show you the plan I have with this <a href="/plan">link.</a></p>
				</div>
			{/if} -->
		</div>
		<form
			id="message-bar"
			method="post"
			use:enhance={() => {
				messages.push(currentMessage);
				messages = messages;
				currentMessage = '';
				waitingForAI = true;
				placeholder = 'Please wait...';
				delay(1100).then(() => {
					chatboxMessages.scrollTo(scrollOptions);
				});
				return async ({ result }) => {
					if (result.type === 'redirect') {
						goto(result.location);
					} else {
						await applyAction(result);
						if (form?.done) {
							return;
						}
					}
					waitingForAI = false;
					placeholder = 'Type here';
				};
			}}
		>
			<input type="hidden" name="lat" value={lat} />
			<input type="hidden" name="lng" value={lng} />
			<input type="hidden" name="messages" bind:value={messagesJson} />
			<input
				type="text"
				id="text-box"
				name="user-message"
				required
				{placeholder}
				bind:value={currentMessage}
				disabled={waitingForAI}
			/>
			<button type="submit" disabled={waitingForAI}><img src={send} alt="send" /></button>
		</form>
	</section>
</div>

<style>
	h1 {
		text-align: center;
		font-size: min(10vh, 14vw);
		line-height: 0.85;
	}

	h2 {
		font-weight: lighter;
		margin-top: 1rem;
		align-self: center;
		text-align: center;
		font-size: min(2.5vh, 5vw);
	}

	#chatbox {
		position: fixed;
		top: 22vh;
		bottom: 2vh;
		width: min(35rem, 100vw - 2rem);
		display: flex;
		flex-direction: column;
	}

	#chatbox-messages {
		border-radius: 20px 20px 0px 0px;
		width: 100%;
		height: 100%;
		overflow-y: scroll;
	}

	#chatbox-messages > img {
		position: absolute;
		border-radius: 20px 20px 0px 0px;
		height: calc(100% - 4rem);
		width: min(35rem, 100vw - 2rem);
		object-fit: cover;
		filter: saturate(20%) brightness(65%) contrast(130%);
		opacity: 90%;
		z-index: -1;
	}

	#message-bar {
		background-color: hsl(220, 20%, 13%);
		width: calc(100% - 1.4rem);
		height: 2.6rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0.7rem;
		border-radius: 0px 0px 20px 20px;
	}

	#message-bar #text-box {
		width: 100%;
		height: 2rem;
		margin-right: 0.1rem;
		border-radius: 20px;
		color: black;
		padding: 0.2rem 0.5rem 0.2rem 0.5rem;
		font-size: 1rem;
		background-color: hsl(60, 20%, 95%);
		outline: none;
	}

	#message-bar button {
		height: 2.6rem;
		width: 4rem;
		margin-left: 0.1rem;
		border-radius: 20px;
		background-color: hsl(220, 15%, 40%);
		padding: 0.3rem;
	}

	#message-bar button img {
		object-fit: cover;
		height: 100%;
	}

	.ai-msg p {
		font-weight: lighter;
		background-color: hsl(254, 49%, 20%);
		padding: 0.7rem;
		border-radius: 20px 20px 20px 0px;
		color: white;
		width: fit-content;
	}

	.ai-msg > div {
		background-color: hsl(254, 49%, 20%);
		padding: 0.7rem;
		border-radius: 20px 20px 20px 0px;
		width: fit-content;
	}

	.ai-msg > div > img {
		filter: saturate(0%) brightness(100%) contrast(0%);
		height: 1.5rem;
		object-fit: cover;
	}

	.ai-msg {
		margin: 1rem 7rem 1rem 1rem;
	}

	.user-msg p {
		font-weight: lighter;
		background-color: hsl(125, 76%, 39%);
		padding: 0.7rem;
		border-radius: 20px 20px 0px 20px;
		color: white;
		width: fit-content;
	}

	.user-msg {
		display: flex;
		justify-content: end;
		flex-direction: row;
		margin: 1rem 1rem 1rem 7rem;
	}
</style>
