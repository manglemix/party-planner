<script>
	import chatbg from '$lib/assets/chat-background.png';
</script>

<h1>Party Planner</h1>
<h2>Create a complete plan, fit for any time, with just a simple conversation!</h2>

<!-- <div id="chatbox-parent"> -->
<section id="chatbox">
    <img src={chatbg} alt="chat background">
</section>
<!-- </div> -->

<style>
    h1 {
        text-align: center;
        font-size: 8rem;
    }

    h2 {
        font-weight: lighter;
        margin-top: 1rem;
        align-self: center;
    }

    /* #chatbox-parent {
        height: 100%;
    } */

    #chatbox {
        background-color: white;
        /* position: absolute; */
        /* top: 3rem; */
        /* bottom: 3rem; */
        width: min(35rem, 100% - 3rem);
        margin-top: 3rem;
        margin-bottom: 3rem;
        height: 100%;
    }

    #chatbox img {
        width: 100%;
        object-fit: cover;
        height: 100%;
        filter: saturate(40%);
    }
</style>