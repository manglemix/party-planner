<script lang="ts">
    import GoogleAdvancedMap from '$lib/GoogleAdvancedMap.svelte';
    let lat = 42.2808;
    let lng = -83.7430;

    let url: string;
</script>

<h2>Here is my <a href={url}>suggestion</a>. If you want to make another plan, click <a href="/">here.</a></h2>

<noscript>
    <h2>You seem to have disabled javascript. I will not be able to show you my idea!</h2>
</noscript>

{#if lat && lng}
    <div id="mapContainer">
        <GoogleAdvancedMap lat={lat} lng={lng} bind:url={url} />
    </div>
{/if}

<style>
    h2 {
        font-weight: lighter;
        margin-top: 1rem;
        font-size: min(2.5vh, 4vw);
        background-color: hsl(254, 49%, 20%);
        padding: 0.7rem;
        border-radius: 20px;
        align-self: flex-start;
    }

    #mapContainer {
        position: fixed;
        top: 12vh;
        bottom: 2vh;
        width: min(50rem, 100vw - 2rem);
        display: flex;
        flex-direction: column;
    }
</style>