<script module>
	let defaultVolumeSet = false;

	interface Props {
		player: any;
		channel: any;
		isCurrent: any;
		incrementReadyCount: Function;
		setDefaultVolume: Function;
	}
</script>

<script lang="ts">
	import { getRandomInt } from './constants';

	let {
		player = $bindable(),
		channel,
		incrementReadyCount,
		setDefaultVolume,
		isCurrent
	}: Props = $props();
	let playerElement: HTMLDivElement | undefined = $state();
	let playerState = $state(-1);

	const { id, url, max } = channel;

	$effect(() => {
		player = new window.YT.Player(playerElement, {
			height: '0',
			width: '0',
			videoId: url,
			events: {
				onReady: (e) => {
					incrementReadyCount();

					if (!defaultVolumeSet) {
						console.log(player);
						setDefaultVolume(player.getVolume());
						defaultVolumeSet = true;
						console.log(defaultVolumeSet);
					}
				},
				onStateChange: (e) => {
					playerState = e.data;
				}
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

<div class="relative flex max-h-80 min-h-80 min-w-80 flex-col items-center justify-center">
	<img
		{id}
		class="size-72 object-contain duration-300 ease-out"
		class:grayscale={!isCurrent}
		class:scale-125={isCurrent}
		src="logos/{id}.webp"
		alt=""
	/>
	<svg
		class:hidden={playerState != 3}
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		class="absolute -bottom-4 z-10 size-12 animate-spin stroke-base-500"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
		/>
	</svg>
</div>
