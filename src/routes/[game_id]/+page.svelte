<script lang="ts">
	import { page } from '$app/stores';
	import { CHANNEL_SIZE, CHANNEL_TOTAL, games } from '$lib/constants';
	import Player from '$lib/Player.svelte';

	// TODO: radio crack before switch
	// TODO: add the missing radios
	// TODO: squoosh assets

	const { channels } = games[$page.params.game_id];
	const channelCount = channels.length;

	let parent: HTMLDivElement | undefined = $state();
	let players: any[] = $state([]);
	let volume = $state(50);
	let readyCount = $state(0);
	let innerWidth = $state(0);
	let allChannelsReady = $state(false);
	let currentChannelIndex = $state(-1);
	let offsetX = $derived(currentChannelIndex * -CHANNEL_TOTAL);

	$inspect(volume);

	function setVolume(v: number) {
		if (v > 100) {
			volume = 100;
			return;
		} else if (v < 0) {
			volume = 0;
			return;
		}

		for (let player of players) {
			player.setVolume(v);
		}

		volume = v;
	}

	function setDefaultVolume(v: number) {
		volume = v;
	}

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

		if (players[i].isMuted()) {
			players[i].unMute();
		} else {
			players[i].playVideo();
		}

		currentChannelIndex = i;
	}

	function toggleRadio() {
		const player = players[currentChannelIndex];

		if (currentChannelIndex != -1) {
			if (player.isMuted()) {
				player.unMute();
			} else {
				player.mute();
			}
		} else {
			currentChannelIndex = 0;
			players[currentChannelIndex].playVideo();
		}
	}

	function handle(e: KeyboardEvent) {
		if (!allChannelsReady) return;
		e.preventDefault();
		console.log(e.code);

		if (e.code == 'ArrowRight') {
			playChannel(currentChannelIndex + 1);
		} else if (e.code == 'ArrowLeft') {
			playChannel(currentChannelIndex - 1);
		} else if (e.code == 'ArrowUp') {
			setVolume(volume + 5);
		} else if (e.code == 'ArrowDown') {
			setVolume(volume - 5);
		} else if (e.code == 'Space') {
			toggleRadio();
		}
	}
</script>

<svelte:window onkeydown={handle} bind:innerWidth />

<main class="flex h-full w-full flex-col items-start justify-center">
	<div
		class:invisible={!allChannelsReady}
		class="relative flex h-full w-full flex-row items-start justify-start overflow-hidden"
	>
		<div
			style="transform: translateX({offsetX}px); padding-left: {(innerWidth - CHANNEL_SIZE) / 2}px;"
			class="parent absolute left-0 flex h-full w-full flex-row items-center gap-32 transition-transform"
			bind:this={parent}
		>
			{#each channels as channel, i}
				<Player
					isCurrent={i == currentChannelIndex}
					{channel}
					{incrementReadyCount}
					{setDefaultVolume}
					bind:player={players[i]}
				></Player>
			{/each}
		</div>
	</div>
	<div class:invisible={!allChannelsReady} class="h-1/5 w-full bg-base-900 p-4">
		<p class="text-base-400">
			Use arrow keys to switch channels and adjust volume. Press space to toggle radio
		</p>
	</div>
	<p class:invisible={allChannelsReady} class="absolute self-center justify-self-center text-2xl">
		Loading... ({readyCount} / {channelCount})
	</p>
</main>

<style>
	.parent {
		transition-property: transform;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 300ms;
	}

	button {
		@apply hover:text-amber-500;
	}
</style>
