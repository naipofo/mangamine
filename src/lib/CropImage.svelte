<script lang="ts">
	export let src: string;
	type coord = [number, number];

	let start: coord = [0, 0];
	let end: coord = [0, 0];

	let cont: HTMLDivElement;
	let bb: DOMRect | null;
	let selecting = false;
	let selected = false;

	function down(event: MouseEvent) {
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
		move(event);
		selecting = false;
		selected = true;
		window.removeEventListener('mousemove', move);
		window.removeEventListener('mouseup', up);
	}
</script>

<div bind:this={cont}>
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<img {src} alt="" on:mousedown={down} draggable="false" />
	<svg viewBox="0 0 1 1" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
		{#if selecting || selected}
			<defs>
				<mask id="selection">
					<rect width="1" height="1" fill="white" />
					<rect
						x={start[0] / (bb?.width ?? 1)}
						y={start[1] / (bb?.height ?? 1)}
						width={(end[0] - start[0]) / (bb?.width ?? 1)}
						height={(end[1] - start[1]) / (bb?.height ?? 1)}
					/>
				</mask>
			</defs>
			<rect width="1" height="1" mask="url(#selection)" fill="#0008" />
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
