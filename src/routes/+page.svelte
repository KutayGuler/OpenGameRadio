<script lang="ts">
	import { radios } from '$lib/constants';
	import Player from '$lib/Player.svelte';

	// TODO: change audio levels
	// TODO: play/pause specific player
	// TODO: carousel
	// TODO: center all images
	// TODO: get GTA IV font

	let players: any[] = [];
	let readyCount = 0;
	let currentChannelIndex = -1;
	let allRadiosReady = false;

	function incrementReadyCount() {
		readyCount++;

		if (readyCount == Object.keys(radios).length) {
			allRadiosReady = true;
		}
	}

	function playChannel(i: number) {
		if (currentChannelIndex != -1) {
			players[currentChannelIndex].pauseVideo();
		}

		players[i].playVideo();
		currentChannelIndex = i;
	}

	function turnOff() {
		if (currentChannelIndex != -1) {
			players[currentChannelIndex].pauseVideo();
		}
	}

	function handle(e: KeyboardEvent) {
		if (!allRadiosReady) return;

		if (e.key == 'ArrowRight') {
			playChannel(currentChannelIndex + 1);
		} else if (e.key == 'ArrowLeft') {
			playChannel(currentChannelIndex - 1);
		} else if (e.key == 'Space') {
		}
	}
</script>

<button on:click={turnOff}>Turn off radio</button>

<svelte:window on:keydown={handle} />

{#if window.YT}
	<div class:opacity-0={!allRadiosReady} class="flex w-full flex-row overflow-y-auto px-8">
		{#each radios as channel, i}
			{@const isCurrent = i == currentChannelIndex}

			<Player
				{isCurrent}
				YT={window.YT}
				{channel}
				bind:player={players[i]}
				on:ready={incrementReadyCount}
			></Player>
		{/each}
	</div>
	<p class:hidden={allRadiosReady}>Loading... ({readyCount} / {Object.keys(radios).length})</p>
{/if}
