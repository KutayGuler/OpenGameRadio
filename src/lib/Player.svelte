<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { getRandomInt } from './constants';
	const dispatch = createEventDispatcher();

	export let YT: any;
	export let player: any;
	export let channel: any;
	export let isCurrent;
	let playerElement: HTMLDivElement;

	const { id, url, max } = channel;

	$: if (isCurrent) {
		playerElement.scrollIntoView();
	}

	onMount(() => {
		player = new window.YT.Player(playerElement, {
			height: '0',
			width: '0',
			videoId: url,
			events: {
				onReady: () => dispatch('ready')
			},
			playerVars: {
				loop: 1,
				start: getRandomInt(max),
				playlist: url
			}
		});
	});
</script>

<div class="absolute hidden" id="player-{id}" bind:this={playerElement}></div>
<img
	class="size-96 object-contain duration-150 ease-out"
	class:grayscale={!isCurrent}
	class:scale-125={isCurrent}
	src="logos/{id}.png"
	alt=""
/>
