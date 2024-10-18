<script lang="ts">
	import { onMount } from 'svelte';
	import YouTubePlayer from 'youtube-player';

	let playerElement: HTMLDivElement;
	let isPlaying = false;
	export let player;
	export let loadArgs: any;

	onMount(() => {
		player = YouTubePlayer(playerElement);
		player.loadVideoById(loadArgs);
	});

	function toggle() {
		player[isPlaying ? 'pauseVideo' : 'playVideo']();
		isPlaying = !isPlaying;
	}
</script>

<button on:click={toggle}>play</button>

<div class="h-40 w-96" id="player" bind:this={playerElement}></div>
