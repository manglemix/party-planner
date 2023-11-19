<script lang="ts">
	import { browser } from '$app/environment';
	import { Loader } from '@googlemaps/js-api-loader';
	export let lat: number;
	export let lng: number;
	export let waypoints: string[] = [];
	export let origin = 'Ann Arbor, MI';
	export let destination = 'Salt Lake City, UT';

	export let url = 'https://www.google.com/maps/dir/';

	url += '+' + origin.replace(' ', '+');

	for (const waypoint of waypoints) {
		url += '/+' + waypoint.replace(' ', '+');
	}

	url += '/+' + destination.replace(' ', '+');

	// export let markers: {
	//     lat: number;
	//     lng: number;
	//     instances: number;
	//     supercategory: string;
	// }[];
	let mapDiv: HTMLElement;
	let directionsDiv: HTMLElement;

	if (browser) {
		const loader = new Loader({
			apiKey: 'AIzaSyCD_xUKchlAhJsO70NU5Cg6XYevRPXI-c0',
			version: 'weekly'
		});

		loader
			.importLibrary('routes')
			.then(async ({ DirectionsService, DirectionsRenderer, TravelMode }) => {
				const { Map } = await loader.importLibrary('maps');

				const map = new Map(mapDiv, {
					center: { lat, lng },
					zoom: 10,
					mapId: '4504f8b37365c3d0'
				});
				map.setTilt(45);
				const directionsService = new DirectionsService();
				const directionsRenderer = new DirectionsRenderer({
					draggable: true,
					map,
					panel: directionsDiv
				});
				directionsService
					.route({
						origin,
						destination,
						waypoints: [
							// { location: "Adelaide, SA" },
							// { location: "Broken Hill, NSW" },
						],
						travelMode: TravelMode.DRIVING,
						avoidTolls: true
					})
					.then((result) => {
						directionsRenderer.setDirections(result);
					})
					.catch((e) => {
						alert('Could not display directions due to: ' + e);
					});
				// var heatMapData = [];

				// for (const markerData of markers) {
				//     if (markerData.supercategory !== supercategory && supercategory !== "all")
				//         continue;
				//     heatMapData.push({
				//         location: new google.maps.LatLng(markerData.lat, markerData.lng),
				//         weight: markerData.instances
				//     });
				// }
				// var heatmap = new HeatmapLayer({
				//     data: heatMapData,
				//     radius: 120
				// });
				// heatmap.setMap(map);
			});
	}
</script>

<div bind:this={mapDiv} style="width: 100%; height: 100%;" />
<div bind:this={directionsDiv} id="directions" />

<!-- <div id="mapContainer">
</div> -->

<style>
	/* #mapContainer {
        display: flex;
        flex-direction: row;
        overflow-y: hidden;
    } */

	#directions {
		/* width: 0px; */
		/* overflow-x: hidden; */
		display: none;
		/* overflow-y: scroll;
        background-color: aliceblue;
        padding: 0.5rem; */
	}

	/* #mapContainer #directions :global(*) {
        color: black;
    } */
</style>
