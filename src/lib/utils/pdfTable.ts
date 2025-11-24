import { rgb, PageSizes, StandardFonts } from 'pdf-lib';

/**
 * Breaks long words into smaller chunks to fit within the column width.
 */
function breakLongWords(text: string, font: any, fontSize: number, maxWidth: number): string[] {
	const words = text.split(' ');
	const lines: string[] = [];
	let currentLine = '';

	words.forEach((word) => {
		if (font.widthOfTextAtSize(word, fontSize) > maxWidth) {
			while (word.length > 0) {
				const chunk = word.slice(0, Math.floor(maxWidth / font.widthOfTextAtSize('a', fontSize)));
				lines.push(chunk);
				word = word.slice(chunk.length);
			}
		} else {
			const potentialLine = currentLine + word + ' ';
			if (font.widthOfTextAtSize(potentialLine, fontSize) > maxWidth) {
				lines.push(currentLine.trim());
				currentLine = word + ' ';
			} else {
				currentLine = potentialLine;
			}
		}
	});

	if (currentLine) {
		lines.push(currentLine.trim());
	}

	return lines;
}

/**
 * Draws text with proper word wrapping and padding.
 */
function drawTextWithWrap(
	page: any,
	text: string,
	font: any,
	fontSize: number,
	x: number,
	y: number,
	maxWidth: number,
	padding: number
) {
	const lines = breakLongWords(text, font, fontSize, maxWidth - padding);
	lines.forEach((line, index) => {
		page.drawText(line, {
			x: x + padding / 2,
			y: y - index * fontSize - padding,
			size: fontSize,
			font,
			color: rgb(0, 0, 0)
		});
	});
}

/**
 * Main function to draw the table.
 */
export async function drawTable(
	table: any,
	startX: number,
	font: any,
	fontSize = 9,
	padding = 10,
	pdfDoc: any
) {
	const headers = table.headers;
	const columnWidths = table.columnWidths;
	const rows = table.rows;
	let page = pdfDoc.addPage(PageSizes.A4);
	let startY = [0];
	const { width, height } = page.getSize();
	startY[0] = height - 100;
	const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

	const title = 'Historial de reclamos';
	const textWidth = boldFont.widthOfTextAtSize(title, 16);
	page.drawText(title, {
		x: (width - textWidth) / 2,
		y: height - 100,
		size: 16,
		font: boldFont,
		color: rgb(0, 0, 0)
	});
	startY[0] -= 30;

	async function checkForNewPage(rowHeight: number): Promise<[any, number[]]> {
		if (startY[0] - rowHeight < 40) {
			page = pdfDoc.addPage(PageSizes.A4);
			startY[0] = height - 50;
		}
		return [page, startY];
	}

	// Draw headers
	for (let index = 0; index < headers.length; index++) {
		const header = headers[index];
		const x = startX + columnWidths.slice(0, index).reduce((acc, curr) => acc + curr, 0);
		const columnWidth = columnWidths[index];

		// Draw header background
		page.drawRectangle({
			x,
			y: startY[0] - fontSize - padding,
			width: columnWidth,
			height: fontSize + padding * 2,
			color: rgb(0.898, 0.906, 0.922) // Light gray
		});

		// Draw header border
		page.drawRectangle({
			x,
			y: startY[0] - fontSize - padding,
			width: columnWidth,
			height: fontSize + padding * 2,
			borderColor: rgb(0, 0, 0),
			borderWidth: 1
		});

		// Draw header text
		drawTextWithWrap(page, header, font, fontSize, x, startY[0] + 5, columnWidth, 5);
	}

	// Adjust Y position for data rows
	startY[0] -= fontSize + padding;

	// Draw rows
	for (let row of rows) {
		let maxRowHeight = 0;

		// Calculate maximum height for the row
		row.forEach((cell, index) => {
			const columnWidth = columnWidths[index];
			const numLines = breakLongWords(cell, font, fontSize, columnWidth - padding).length;
			const cellHeight = numLines * fontSize + padding;
			maxRowHeight = Math.max(maxRowHeight, cellHeight);
		});

		[page, startY] = await checkForNewPage(maxRowHeight);

		// Draw cells in the row
		row.forEach((cell, index) => {
			const x = startX + columnWidths.slice(0, index).reduce((acc, curr) => acc + curr, 0);
			const columnWidth = columnWidths[index];

			// Draw cell border
			page.drawRectangle({
				x,
				y: startY[0] - maxRowHeight,
				width: columnWidth,
				height: maxRowHeight,
				borderColor: rgb(0, 0, 0),
				borderWidth: 1
			});

			// Draw cell text with wrapping
			drawTextWithWrap(page, cell, font, fontSize, x, startY[0], columnWidth, padding);
		});

		// Move Y position down by the maximum row height
		startY[0] -= maxRowHeight;
	}
}
