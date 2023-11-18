<script>
	import chatbg from '$lib/assets/chat-background.png';
	import send from '$lib/assets/send.png';
</script>

<h1>Party Planner</h1>
<h2>Create a complete plan, fit for any time, with just a simple conversation!</h2>

<section id="chatbox">
    <div id="chatbox-messages">
        <img src={chatbg} alt="chat background">
    </div>
    <form id="message-bar" method="post">
        <input type="text" id="text-box" required>
        <button type="submit"><img src={send} alt="send"></button>
    </form>
</section>

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
        /* padding-left: 2rem; */
        /* padding-right: 2rem; */
        display: flex;
        flex-direction: column;
    }

    #chatbox-messages {
        border-radius: 20px 20px 0px 0px;
        width: 100%;
        /* object-fit: cover; */
        height: 100%;
        /* background-color: wheat; */
    }

    #chatbox-messages img {
        position: absolute;
        border-radius: 20px 20px 0px 0px;
        height: calc(100% - 4rem);        
        width: min(35rem, 100vw - 2rem);
        /* right: 1000px; */
        object-fit: cover;
        /* height: 100%; */
        filter: saturate(20%) brightness(65%) contrast(130%);
        opacity: 90%;
    }

    #message-bar {
        background-color: hsl(220, 20%, 13%);;
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
</style>