<script lang="ts">
	import { CHANNEL_GAP, CHANNEL_SIZE, CHANNEL_TOTAL, channelCount, channels } from '$lib/constants';
	import Player from '$lib/Player.svelte';

	// TODO: change audio levels
	// TODO: play/pause specific player
	// TODO: radio crack before switch
	// TODO: squoosh assets

	let parent: HTMLDivElement;
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
			players[currentChannelIndex].mute();
		}

		if (i >= channelCount) {
			i = 0;
		} else if (i < 0) {
			i = channelCount - 1;
		}

		console.log(players[i]);
		if (players[i].isMuted()) {
			players[i].unMute();
		} else {
			players[i].playVideo();
		}

		currentChannelIndex = i;
	}

	function turnOff() {
		if (currentChannelIndex != -1) {
			players[currentChannelIndex].mute();
		}
	}

	function handle(e: KeyboardEvent) {
		if (!allChannelsReady) return;
		e.preventDefault();

		if (e.key == 'ArrowRight') {
			playChannel(currentChannelIndex + 1);
		} else if (e.key == 'ArrowLeft') {
			playChannel(currentChannelIndex - 1);
		} else if (e.key == 'Space') {
			turnOff();
		}
	}

	let offsetX = 0;

	function centerChildByIdFromUrl() {
		offsetX = currentChannelIndex * -CHANNEL_TOTAL;
	}

	$: currentChannelIndex, centerChildByIdFromUrl();
	let innerWidth: number;
</script>

<svelte:window on:keydown={handle} bind:innerWidth />

<main class="flex h-full w-full flex-col items-start p-4">
	<button on:click={turnOff}>Turn off radio</button>

	{#if window.YT}
		<div
			class:opacity-0={!allChannelsReady}
			class="relative flex h-full w-full flex-row items-start justify-start overflow-hidden"
		>
			<div
				style="transform: translateX({offsetX}px); padding-left: {(innerWidth - CHANNEL_SIZE) /
					2}px;"
				class="parent absolute left-0 flex h-full w-full flex-row items-center gap-32 transition-transform"
				bind:this={parent}
			>
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
		</div>
		<p class:hidden={allChannelsReady}>Loading... ({readyCount} / {channelCount})</p>
	{/if}
</main>

<style>
	.parent {
		transition-property: transform;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 300ms;
	}
</style>
