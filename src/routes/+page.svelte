<script lang="ts">
	import Tesseract, { OEM, PSM } from 'tesseract.js';
	import { onMount } from 'svelte';
	import CropImage from '$lib/CropImage.svelte';
	import type { Coord, CropMessage } from '$lib/types';
	import { crop } from '$lib/crop';

	let a = 'asd';

	let worker: Tesseract.Worker;

	let fullImage: string | null = null;
	let croppedImage: string | null = null;

	onMount(async () => {
		worker = await Tesseract.createWorker({
			logger: (m) => console.log(m)
		});
		await worker.loadLanguage('jpn_vert');
		await worker.initialize('jpn_vert');
		await worker.setParameters({
			tessedit_pageseg_mode: PSM.SINGLE_BLOCK_VERT_TEXT,
			tessedit_ocr_engine_mode: OEM.TESSERACT_LSTM_COMBINED
		});
	});
	onMount(() => {
		document.addEventListener('paste', (e) => {
			const items = e.clipboardData?.files;
			if (items) {
				Array.from(items ?? []).forEach((e) => {
					var reader = new FileReader();
					reader.onload = function (event) {
						fullImage = event?.target?.result as string;
					};
					reader.readAsDataURL(e);
				});
			}
		});
	});
	async function cropped(params: CustomEvent<CropMessage>) {
		croppedImage = await crop(fullImage!, params.detail);
	}
	async function croppedText(params: CustomEvent<CropMessage>) {
		const textImage = await crop(croppedImage!, params.detail);
		worker.recognize(textImage, { rotateAuto: false }).then(({ data: { text } }) => {
			console.log(text);
			a = text.replaceAll(' ', '').replaceAll('\n', `<br>`);
		});
	}
</script>

<h3>MangaMine</h3>
<div id="input" class="panel">
	{#if fullImage}
		<CropImage src={fullImage} on:cropped={cropped} />
	{:else}
		<p>paste the page to load</p>
	{/if}
</div>
{#if croppedImage}
	<div id="text-select">
		<CropImage src={croppedImage} on:cropped={croppedText} />
	</div>
{/if}
<div id="output" class="panel">
	{@html a}
</div>

<style>
	.panel {
		margin: 1rem;
		padding: 1rem;
		border: 5px dotted gray;
		border-radius: 2rem;
	}
	#output {
		font-size: 2rem;
	}
</style>
