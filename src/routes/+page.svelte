<script lang="ts">
	import Player from '$lib/Player.svelte';

	// TODO: change audio levels
	// TODO: play/pause specific player
	let players = [];

	const radios = new Array(10).fill('HwIku9OM_UQ');
</script>

<button on:click={() => players[2].playVideo()}>play third</button>

{#each radios as radio, i}
	<Player loadArgs={radio} bind:player={players[i]}></Player>
{/each}
