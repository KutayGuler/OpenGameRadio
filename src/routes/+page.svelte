<script lang="ts">
	import { channelCount, channels } from '$lib/constants';
	import Player from '$lib/Player.svelte';

	// TODO: change audio levels
	// TODO: play/pause specific player
	// TODO: carousel
	// TODO: center all images
	// TODO: get GTA IV font
	// TODO: radio crack before switch
	// TODO: mute instead of pause

	let players: any[] = [];
	let readyCount = 0;
	let currentChannelIndex = -1;
	let allChannelsReady = false;

	function incrementReadyCount() {
		readyCount++;

		if (readyCount == channelCount) {
			allChannelsReady = true;
		}
	}

	function playChannel(i: number) {
		if (currentChannelIndex != -1) {
			players[currentChannelIndex].pauseVideo();
		}

		if (i > channelCount) {
			i = 0;
		} else if (i < 0) {
			i = channelCount - 1;
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
		if (!allChannelsReady) return;

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
	<div class:opacity-0={!allChannelsReady} class="flex w-full flex-row overflow-y-auto px-8">
		{#each channels as channel, i}
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
	<p class:hidden={allChannelsReady}>Loading... ({readyCount} / {channelCount})</p>
{/if}
