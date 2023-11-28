<script lang="ts">
	import { fade } from 'svelte/transition';
	import GoogleAdvancedMap from '$lib/GoogleAdvancedMap.svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_HOST } from '$env/static/public';
	export let data;
	let url: string;

	let informationLoaded = false;
	let errorFaced = false;
	let noPath = false;
	let waypoints: string[] = [];
	let places: any[] = [];
	let mode = '';
	let lastMessage = '';
	$: if (errorFaced) {
		delay(2500).then(() => {
			goto('/?reset=true');
		});
	}

	const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

	if (browser) {
		fetch(`https://${PUBLIC_BACKEND_HOST}/final-plan/`, {
			method: 'post',
			body: JSON.stringify({ sessionToken: data.sessionToken, lat: data.lat, lng: data.lng })
		})
			.then(async (response) => {
				if (!response.ok) {
					const text = await response.text();
					console.log('Error code: ' + response.status);
					console.log(text);
					errorFaced = true;
					return;
				}
				const body = await response.json();
				places = body['places'];
				if (places.length == 0) {
					noPath = true;
					delay(2500).then(() => {
						goto('/?reset=true');
					});
					return;
				}
				for (const place of places) {
					waypoints.push(place.waypoint);
					//     if (place.photoID === "") {
					//     	waypoints.push(place.waypoint);
					// }
				}
				// for (let i = 0; i < places.length; i++) {
				//     if (places[i].photoID === "") {
				//     	waypoints.push(places[i].waypoint);
				// 		let j = i + 1;
				// 		while (true) {
				// 			if (j >= places.length) {
				// 				j = 0;
				// 				continue;
				// 			}
				// 			if (j == i) {
				// 				break;
				// 			}
				//     		waypoints.push(places[j].waypoint);
				// 		}
				// 		break;
				//     }
				// }
				console.log(waypoints);
				mode = body['mode'];
				lastMessage = body['lastMessage'];
				informationLoaded = true;
			})
			.catch((e) => {
				console.log(e);
				errorFaced = true;
			});
	}
</script>

<div class="page" transition:fade|global={{ duration: 700 }}>
	{#if errorFaced}
		<h2>I seem to have faced an issue. Let's try this again shall we?</h2>
	{:else if noPath}
		<h2>
			I'm sorry, but I can't seem to find a route that fits your needs. Let's find something else
			that you'd like!
		</h2>
	{:else if informationLoaded}
		<h2>
			{lastMessage} If you want to make another plan, click
			<a href="/?reset=true">here.</a>
		</h2>

		{#each places as place, i}
			{#if place.photoID !== ''}
				<h3>{place.waypoint}</h3>
				<img
					src={`https://places.googleapis.com/v1/${place.photoID}/media?key=AIzaSyCD_xUKchlAhJsO70NU5Cg6XYevRPXI-c0&maxHeightPx=640&maxWidthPx=640`}
					alt={place.waypoint}
				/>
			{/if}
		{/each}

		<div id="mapContainer">
			<GoogleAdvancedMap bind:url bind:waypoints bind:mode />
		</div>
	{:else}
		<noscript>
			<h2>You seem to have disabled javascript. I will not be able to show you the route here!</h2>
		</noscript>
		<svg class="bike" viewBox="0 0 48 30" width="48px" height="30px">
			<g
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1"
			>
				<g transform="translate(9.5,19)">
					<circle class="bike__tire" r="9" stroke-dasharray="56.549 56.549" />
					<g class="bike__spokes-spin" stroke-dasharray="31.416 31.416" stroke-dashoffset="-23.562">
						<circle class="bike__spokes" r="5" />
						<circle class="bike__spokes" r="5" transform="rotate(180,0,0)" />
					</g>
				</g>
				<g transform="translate(24,19)">
					<g
						class="bike__pedals-spin"
						stroke-dasharray="25.133 25.133"
						stroke-dashoffset="-21.991"
						transform="rotate(67.5,0,0)"
					>
						<circle class="bike__pedals" r="4" />
						<circle class="bike__pedals" r="4" transform="rotate(180,0,0)" />
					</g>
				</g>
				<g transform="translate(38.5,19)">
					<circle class="bike__tire" r="9" stroke-dasharray="56.549 56.549" />
					<g class="bike__spokes-spin" stroke-dasharray="31.416 31.416" stroke-dashoffset="-23.562">
						<circle class="bike__spokes" r="5" />
						<circle class="bike__spokes" r="5" transform="rotate(180,0,0)" />
					</g>
				</g>
				<polyline class="bike__seat" points="14 3,18 3" stroke-dasharray="5 5" />
				<polyline
					class="bike__body"
					points="16 3,24 19,9.5 19,18 8,34 7,24 19"
					stroke-dasharray="79 79"
				/>
				<path class="bike__handlebars" d="m30,2h6s1,0,1,1-1,1-1,1" stroke-dasharray="10 10" />
				<polyline class="bike__front" points="32.5 2,38.5 19" stroke-dasharray="19 19" />
			</g>
		</svg>
		<style>
			.bike,
			.bike * {
				--hue: 223;
				--bg: hsl(var(--hue), 90%, 90%);
				--fg: hsl(var(--hue), 90%, 10%);
				--primary: hsl(var(--hue), 90%, 50%);
				--trans-dur: 0.3s;
				font-size: calc(16px + (32 - 16) * (100vw - 320px) / (2560 - 320));
			}
			.bike {
				display: block;
				margin: auto;
				width: 16em;
				height: auto;
			}
			.bike__body,
			.bike__front,
			.bike__handlebars,
			.bike__pedals,
			.bike__pedals-spin,
			.bike__seat,
			.bike__spokes,
			.bike__spokes-spin,
			.bike__tire {
				animation: bikeBody 3s ease-in-out infinite;
				stroke: var(--primary);
				transition: stroke var(--trans-dur);
			}
			.bike__front {
				animation-name: bikeFront;
			}
			.bike__handlebars {
				animation-name: bikeHandlebars;
			}
			.bike__pedals {
				animation-name: bikePedals;
			}
			.bike__pedals-spin {
				animation-name: bikePedalsSpin;
			}
			.bike__seat {
				animation-name: bikeSeat;
			}
			.bike__spokes,
			.bike__tire {
				stroke: currentColor;
			}
			.bike__spokes {
				animation-name: bikeSpokes;
			}
			.bike__spokes-spin {
				animation-name: bikeSpokesSpin;
			}
			.bike__tire {
				animation-name: bikeTire;
			}

			/* Dark theme */
			@media (prefers-color-scheme: dark) {
				:root {
					--bg: hsl(var(--hue), 90%, 10%);
					--fg: hsl(var(--hue), 90%, 90%);
				}
			}

			/* Animations */
			@keyframes bikeBody {
				from {
					stroke-dashoffset: 79;
				}
				33%,
				67% {
					stroke-dashoffset: 0;
				}
				to {
					stroke-dashoffset: -79;
				}
			}
			@keyframes bikeFront {
				from {
					stroke-dashoffset: 19;
				}
				33%,
				67% {
					stroke-dashoffset: 0;
				}
				to {
					stroke-dashoffset: -19;
				}
			}
			@keyframes bikeHandlebars {
				from {
					stroke-dashoffset: 10;
				}
				33%,
				67% {
					stroke-dashoffset: 0;
				}
				to {
					stroke-dashoffset: -10;
				}
			}
			@keyframes bikePedals {
				from {
					animation-timing-function: ease-in;
					stroke-dashoffset: -25.133;
				}
				33%,
				67% {
					animation-timing-function: ease-out;
					stroke-dashoffset: -21.991;
				}
				to {
					stroke-dashoffset: -25.133;
				}
			}
			@keyframes bikePedalsSpin {
				from {
					transform: rotate(0.1875turn);
				}
				to {
					transform: rotate(3.1875turn);
				}
			}
			@keyframes bikeSeat {
				from {
					stroke-dashoffset: 5;
				}
				33%,
				67% {
					stroke-dashoffset: 0;
				}
				to {
					stroke-dashoffset: -5;
				}
			}
			@keyframes bikeSpokes {
				from {
					animation-timing-function: ease-in;
					stroke-dashoffset: -31.416;
				}
				33%,
				67% {
					animation-timing-function: ease-out;
					stroke-dashoffset: -23.562;
				}
				to {
					stroke-dashoffset: -31.416;
				}
			}
			@keyframes bikeSpokesSpin {
				from {
					transform: rotate(0);
				}
				to {
					transform: rotate(3turn);
				}
			}
			@keyframes bikeTire {
				from {
					animation-timing-function: ease-in;
					stroke-dashoffset: 56.549;
					transform: rotate(0);
				}
				33% {
					stroke-dashoffset: 0;
					transform: rotate(0.33turn);
				}
				67% {
					animation-timing-function: ease-out;
					stroke-dashoffset: 0;
					transform: rotate(0.67turn);
				}
				to {
					stroke-dashoffset: -56.549;
					transform: rotate(1turn);
				}
			}
		</style>
	{/if}
</div>

<style>
	h2 {
		font-weight: lighter;
		margin-top: 1rem;
		font-size: min(2.5vh, 3vw);
		background-color: hsl(254, 49%, 20%);
		padding: 0.7rem;
		border-radius: 20px 20px 20px 0px;
		align-self: flex-start;
	}

	h3 {
		margin-top: 1rem;
		font-size: min(2.5vh, 3vw);
	}

	#mapContainer {
		margin-top: 1rem;
		height: min(50rem, 100vw - 2rem);
		width: min(50rem, 100vw - 2rem);
		display: flex;
		flex-direction: column;
	}

	.page {
		min-height: 100vh;
	}
</style>
