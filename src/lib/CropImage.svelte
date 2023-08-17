<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Coord } from './types';

	export let src: string;

	let start: Coord = [0, 0];
	let end: Coord = [0, 0];

	function getRelative(c: Coord): Coord {
		return bb ? [c[0] / (bb?.width ?? 1), c[1] / (bb?.height ?? 1)] : [0, 0];
	}
	$: startRelative = getRelative(start);
	$: endRelative = getRelative(end);

	const dispatch = createEventDispatcher();

	let cont: HTMLDivElement;
	let bb: DOMRect | null;
	let selecting = false;
	let selected = false;

	function down(event: MouseEvent) {
		if (event.buttons !== 1) return;
		bb = cont.getBoundingClientRect();
		console.log(event.pageY);

		start = [event.clientX - bb.left, event.clientY - bb.top];
		end = start;
		selecting = true;
		window.addEventListener('mousemove', move);
		window.addEventListener('mouseup', up);
	}
	function move(event: MouseEvent) {
		if (selecting) end = [end[0] + event.movementX, end[1] + event.movementY];
	}
	function up(event: MouseEvent) {
		if (!selecting) return;
		move(event);
		selecting = false;
		selected = true;
		window.removeEventListener('mousemove', move);
		window.removeEventListener('mouseup', up);
		dispatch('cropped', {
			start: startRelative,
			end: endRelative
		});
	}

	let r = Math.random();
</script>

<div bind:this={cont}>
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<img {src} alt="" on:mousedown={down} draggable="false" />
	<svg viewBox="0 0 1 1" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
		{#if selecting || selected}
			<defs>
				<mask id="selection{r}">
					<rect width="1" height="1" fill="white" />
					<rect
						x={startRelative[0]}
						y={startRelative[1]}
						width={endRelative[0] - startRelative[0]}
						height={endRelative[1] - startRelative[1]}
					/>
				</mask>
			</defs>
			<rect width="1" height="1" mask="url(#selection{r})" fill="#0008" />
		{/if}
	</svg>
</div>

<style>
	div {
		position: relative;
	}
	img {
		user-select: none;
		width: 100%;
	}
	svg {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		pointer-events: none;
	}
</style>
