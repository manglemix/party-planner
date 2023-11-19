<script lang="ts">
	import { browser } from '$app/environment';
	import { Loader } from '@googlemaps/js-api-loader';
	export let waypoints: string[];
	export let mode: string;

	export let url = 'https://www.google.com/maps/dir';

	// url += '+' + origin.replace(' ', '+');

	for (const waypoint of waypoints) {
		url += '/+' + waypoint.replace(' ', '+');
	}
	url += '/+' + waypoints[0].replace(' ', '+');

	let mapDiv: HTMLElement;
	// let directionsDiv: HTMLElement;

	$: if (browser && mapDiv) {
		const loader = new Loader({
			apiKey: 'AIzaSyCD_xUKchlAhJsO70NU5Cg6XYevRPXI-c0',
			version: 'weekly'
		});

		loader
			.importLibrary('routes')
			.then(async ({ DirectionsService, DirectionsRenderer, TravelMode }) => {
				const { Map } = await loader.importLibrary('maps');

				const map = new Map(mapDiv, {
					zoom: 10,
					mapId: '4504f8b37365c3d0'
				});
				map.setTilt(45);
				const directionsService = new DirectionsService();
				const directionsRenderer = new DirectionsRenderer({
					draggable: true,
					map,
					// panel: directionsDiv
				});
				let travelMode;

				if (mode === "walking") {
					travelMode = TravelMode.WALKING;
				} else if (mode === "bicycling") {
					travelMode = TravelMode.BICYCLING;
				} else if (mode === "transit") {
					travelMode = TravelMode.TRANSIT;
				} else {
					travelMode = TravelMode.DRIVING;
				}

				directionsService
					.route({
						origin: waypoints[0],
						destination: waypoints[0],
						waypoints: waypoints.slice(1).map((value) => { return { location: value }; }),
						travelMode,
					})
					.then((result: any) => {
						directionsRenderer.setDirections(result);
					})
					.catch((e: any) => {
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

<div bind:this={mapDiv} style="width: 100%; height: 100%;" id="map"/>
<!-- <div bind:this={directionsDiv} id="directions" /> -->

<!-- <div id="mapContainer">
</div> -->

<style>
	#map {
		height: 100%;
		width: 100%;
	}
	/* #mapContainer {
        display: flex;
        flex-direction: row;
        overflow-y: hidden;
    } */

	/* #directions {
		/* width: 0px; */
		/* overflow-x: hidden; */
		/* display: none; */
		/* overflow-y: scroll;
        background-color: aliceblue;
        padding: 0.5rem; */
	

	/* #mapContainer #directions :global(*) {
        color: black;
    } */
</style>
