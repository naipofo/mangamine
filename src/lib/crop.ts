import type { CropMessage } from './types';

export async function crop(imageUrl: string, details: CropMessage): Promise<string> {
	const canavs = document.querySelector('canvas#crop') as HTMLCanvasElement;
	const img = new Image();
	img.src = imageUrl;
	await new Promise((r) => (img.onload = r));
	const w = img.width * (details.end[0] - details.start[0]);
	const h = img.height * (details.end[1] - details.start[1]);

	canavs.width = w;
	canavs.height = h;

	const context = canavs.getContext('2d');
	context?.drawImage(
		img,
		details.start[0] * img.width,
		details.start[1] * img.height,
		w,
		h,
		0,
		0,
		w,
		h
	);
	return canavs.toDataURL();
}
