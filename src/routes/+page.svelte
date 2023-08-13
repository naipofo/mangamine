<script lang="ts">
	import Tesseract, { OEM, PSM } from 'tesseract.js';
	import { onMount } from 'svelte';
	let a = 'asd';

	let worker;

	let fullImage: string | null = null;

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
		worker
			.recognize('https://i.imgur.com/zTw5D1h.png', { rotateAuto: true })
			.then(({ data: { text } }) => {
				console.log(text);
				a = text.replaceAll(' ', '').replaceAll('\n', `<br>`);
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
</script>

<h3>MangaMine</h3>
<div id="input" class="panel">
	{#if fullImage}
		<img src={fullImage} alt="" id="full-img" />
	{:else}
		<p>paste the page to load</p>
	{/if}
</div>
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

	#full-img {
		width: 100%;
	}
</style>
