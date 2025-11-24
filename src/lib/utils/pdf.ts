import { PageSizes, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { capitalizeFirstLetter } from '$lib/utils/capitalizeFirstLetter';
import { formatDate } from '$lib/utils/dateUtils.js';
import { drawTable } from './pdfTable';
import type { PdfImage } from '$lib/interfaces/pdfimage.interface';
import { drawImages } from './pdfImages';

export default async function generatePDF(pdfData: any, images: PdfImage[] = []) {
	const reclamo = pdfData.reclamo;
	const pdfDoc = await PDFDocument.create();
	const mainPage = pdfDoc.addPage(PageSizes.A4);
	const { width, height } = mainPage.getSize();
	const fontSize = 12;

	const startY = {
		value: height - 100
	};

	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
	const textColor = rgb(0, 0, 0);
	const x = 50;
	const hrWidth = 500;

	function drawParagraph(
		page: any,
		text: string,
		startX: number,
		startY: { value: number },
		font: any,
		fontSize: number,
		maxWidth: number,
		lineHeight: number
	) {
		drawJustifiedText(page, text, startX, startY.value, font, fontSize, maxWidth, lineHeight);

		const lines = text.split('\n');
		lines.forEach((line) => {
			const lineCount = Math.ceil(font.widthOfTextAtSize(line, fontSize) / maxWidth);
			startY.value -= lineHeight * lineCount;
		});
	}

	function drawJustifiedText(
		page: any,
		text: string,
		x: number,
		y: number,
		font: any,
		fontSize: number,
		maxWidth: number,
		lineHeight: number
	) {
		const words = text.split(' ');
		let currentLine = '';
		let currentY = y;
		let lines: string[] = [];

		// Prepare lines of text
		words.forEach((word) => {
			const testLine = currentLine ? currentLine + ' ' + word : word;
			const textWidth = font.widthOfTextAtSize(testLine, fontSize);

			if (textWidth < maxWidth) {
				currentLine = testLine;
			} else {
				lines.push(currentLine);
				currentLine = word;
			}
		});
		if (currentLine) lines.push(currentLine);

		// Draw each line
		lines.forEach((line, index) => {
			const wordsInLine = line.split(' ');
			let lineTextWidth = font.widthOfTextAtSize(line, fontSize);
			let spaceWidth = font.widthOfTextAtSize(' ', fontSize);

			// Justify except the last line
			let extraSpace = 0;
			if (index < lines.length - 1 && wordsInLine.length > 1) {
				extraSpace = (maxWidth - lineTextWidth) / (wordsInLine.length - 1);
			}

			let currentX = x;
			wordsInLine.forEach((word, wordIndex) => {
				page.drawText(word.replace(/[^\S ]+/g, ' '), {
					x: currentX,
					y: currentY,
					size: fontSize,
					font: font,
					lineHeight: lineHeight - 4,
					color: rgb(0, 0, 0)
				});

				if (wordIndex < wordsInLine.length - 1) {
					currentX += font.widthOfTextAtSize(word, fontSize) + spaceWidth + extraSpace;
				}
			});
			currentY -= lineHeight - 2;
		});
	}

	const draw2cols = (
		textLeft: string,
		textRight: string,
		startY: { value: number },
		font: any,
		fontSize: number,
		lineHeight: number
	) => {
		const startY2 = { ...startY };
		drawParagraph(mainPage, textLeft, x, startY, font, fontSize, width / 2 - x - 20, lineHeight);
		drawParagraph(
			mainPage,
			textRight,
			width / 2 + 20,
			startY2,
			font,
			fontSize,
			width / 2 - x,
			lineHeight
		);
		startY.value = Math.min(startY.value, startY2.value);
	};

	async function drawHeader() {
		const pngUrl = '/images/home-logo.png';
		const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer());
		const pngImage = await pdfDoc.embedPng(pngImageBytes);
		const pngDims = pngImage.scale(0.33);
		mainPage.drawImage(pngImage, {
			x: width - pngDims.width - x,
			y: height - 83 - pngDims.height,
			width: pngDims.width,
			height: pngDims.height
		});
		drawParagraph(
			mainPage,
			`Motivo del reclamo: "${capitalizeFirstLetter(reclamo?.motivo)}"`,
			x,
			startY,
			boldFont,
			16,
			width - pngDims.width - 150,
			20
		);
		startY.value -= 30;
	}
	await drawHeader();

	draw2cols(
		`N° Reclamo: ${reclamo.id}`,
		`Creado el: ${formatDate(reclamo.createdAt)}`,
		startY,
		font,
		fontSize,
		20
	);
	draw2cols(
		`Ubicacion: ${reclamo?.ubicacion ? reclamo?.ubicacion : 'Sin ubicación'}`,
		`Detalle de ubicación: ${reclamo?.ubicacionDetalle ? reclamo?.ubicacionDetalle : 'Sin ubicación'}`,
		startY,
		font,
		fontSize,
		20
	);
	draw2cols(
		`Descripción: ${pdfData?.descripcion}`,
		`Operador: ${reclamo?.creador?.usuario?.apellido}, ${reclamo?.creador?.usuario?.nombre}`,
		startY,
		font,
		fontSize,
		20
	);

	mainPage.drawLine({
		start: { x: x, y: startY.value },
		end: { x: x + hrWidth, y: startY.value },
		thickness: 0.25,
		color: rgb(0, 0, 0)
	});

	startY.value -= 20;
	mainPage.drawText('Ciudadano que realizó el reclamo:', {
		x,
		y: startY.value,
		size: fontSize,
		font: font,
		color: textColor
	});

	startY.value -= 12;
	mainPage.drawLine({
		start: { x: x, y: startY.value },
		end: { x: x + hrWidth, y: startY.value },
		thickness: 0.75,
		color: rgb(0, 0, 0)
	});
	startY.value -= 25;

	draw2cols(
		`Apellido y nombre: ${reclamo?.ciudadano?.apellido}, ${reclamo?.ciudadano?.nombre}`,
		`Dirección: ${reclamo?.ciudadano?.direccion}`,
		startY,
		font,
		fontSize,
		20
	);

	draw2cols(
		`Teléfono: ${reclamo?.ciudadano?.telefono}`,
		`Canal utilizado: ${reclamo?.canal?.descripcion}`,
		startY,
		font,
		fontSize,
		20
	);

	startY.value += 5;
	mainPage.drawLine({
		start: { x: x, y: startY.value },
		end: { x: x + hrWidth, y: startY.value },
		thickness: 0.25,
		color: rgb(0, 0, 0)
	});

	await drawTable(pdfData.table, x, font, 11, 10, pdfDoc);

	await drawImages(images, pdfDoc, boldFont);

	const pdfBytes = await pdfDoc.save();

	const blob = new Blob([pdfBytes], { type: 'application/pdf' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `reclamo_${reclamo.id}.pdf`;
	a.click();
}
