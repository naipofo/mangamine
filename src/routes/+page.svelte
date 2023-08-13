<script lang="ts">
	import Tesseract, { OEM, PSM } from 'tesseract.js';
	import { onMount } from 'svelte';
	let a = 'asd';

	let worker;

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
</script>

<h1>Welcome to SvelteKit</h1>
{@html a}
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
