<slot />

<style>
	@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@200;400;700&display=swap');

	:global(*) {
		font-family: 'Kanit', sans-serif;
		line-height: 1;
		margin: 0px;
		padding: 0px;
		color: white;
	}

	:global(body) {
		display: flex;
		flex-direction: column;
		background-color: hsl(210, 60%, 3%);
	}

	:global(.page) {
		position: fixed;
		width: min(50rem, 100% - 3rem);
		align-self: center;
		align-items: center;
		height: 100vh;
		/* min-height: calc(100vh - 10rem); */
		display: flex;
		flex-direction: column;
		background-color: hsl(210, 85%, 5%);
		padding: 0.5rem 3rem 0rem 3rem;
		box-shadow: 0px 0px 100px hsl(210, 30%, 29%);
	}
</style>
