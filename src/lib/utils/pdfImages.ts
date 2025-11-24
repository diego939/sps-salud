import type { PdfImage } from '$lib/interfaces/pdfimage.interface';
import { PageSizes, PDFDocument, rgb } from 'pdf-lib';

export async function drawImages(images: PdfImage[], pdfDoc: PDFDocument, font: any) {
	const objsWithoutPdfs: PdfImage[] = [];
	const objsWithOnlyPdfs: PdfImage[] = [];

	images.forEach((obj: PdfImage) => {
		const pdfs = obj.archivos.filter((archivo) => /\.(pdf)$/i.test(archivo)); // Extract PDFs
		const nonPdfs = obj.archivos.filter((archivo) => !/\.(pdf)$/i.test(archivo)); // Extract non-PDFs

		if (nonPdfs.length > 0) {
			// Add the object to objsWithoutPdfs if there are non-PDFs
			objsWithoutPdfs.push({
				orden: obj.orden,
				archivos: nonPdfs,
				reclamoId: obj.reclamoId
			});
		}

		if (pdfs.length > 0) {
			// Add the object to objsWithOnlyPdfs if there are PDFs
			objsWithOnlyPdfs.push({
				orden: obj.orden,
				archivos: pdfs,
				reclamoId: obj.reclamoId
			});
		}
	});

	// Después de finalizar la página principal, si hay imágenes, agrégalas:
	if (objsWithoutPdfs && objsWithoutPdfs.length > 0) {
		// Crear una nueva página para el título de las imágenes
		const imagesTitlePage = pdfDoc.addPage(PageSizes.A4);
		const { width: imgPageWidth, height: imgPageHeight } = imagesTitlePage.getSize();
		const title = 'Imágenes adjuntas';
		const textWidth = font.widthOfTextAtSize(title, 16);

		// Dibujar el título centrado en la página de imágenes
		imagesTitlePage.drawText(title, {
			x: (imgPageWidth - textWidth) / 2,
			y: imgPageHeight - 100,
			size: 16,
			font: font,
			color: rgb(0, 0, 0)
		});

		let currentPage = imagesTitlePage;
		let currentY = imgPageHeight - 120;
		const verticalSpacing = 20;
		const pageMargin = 50;

		for (const obj of objsWithoutPdfs) {
			currentPage.drawLine({
				start: { x: 50, y: currentY },
				end: { x: 50 + 500, y: currentY },
				thickness: 0.25,
				color: rgb(0, 0, 0)
			});

			currentY -= 4;
			// here write obj.orden if there is enough space in the page
			const ordenText = `Reclamo: ${obj.reclamoId}-${obj.orden}`;
			const ordenTextHeight = 16; // Assume a font size of 16 for the orden text
			const ordenTextSpacing = 10; // Add some spacing below the orden text

			// First, write the orden if there's enough space
			if (currentY - (ordenTextHeight + ordenTextSpacing) < pageMargin) {
				currentPage = pdfDoc.addPage(PageSizes.A4);
				currentY = currentPage.getHeight() - 50; // Reset Y position near the top of the new page
			}

			currentPage.drawText(ordenText, {
				x: pageMargin,
				y: currentY - ordenTextHeight,
				size: 16,
				font: font,
				color: rgb(0, 0, 0)
			});

			currentY -= ordenTextHeight + ordenTextSpacing;

			for (const imageSrc of obj.archivos) {
				try {
					if (!/\.(png|jpe?g)$/i.test(imageSrc)) {
						console.warn(`Imagen no soportada, se omite: ${imageSrc}`);
						continue; // Saltar a la siguiente iteración
					}
					const jpegArrayBuffer = await convertImageToJpeg(imageSrc);
					const embeddedImage = await pdfDoc.embedJpg(jpegArrayBuffer);

					const pWidth = currentPage.getWidth();
					const pHeight = currentPage.getHeight();

					// Dimensiones originales de la imagen
					let iWidth = embeddedImage.width;
					let iHeight = embeddedImage.height;

					// Verificar si el ancho de la imagen excede el ancho de la página y redimensionar proporcionalmente si es necesario
					if (iWidth > 500) {
						const scaleFactor = 500 / iWidth;
						iWidth = 500;
						iHeight = iHeight * scaleFactor;
					}
					//
					// Verificar si el ancho de la imagen excede el ancho de la página y redimensionar proporcionalmente si es necesario
					if (iHeight > 600) {
						const scaleFactor = 600 / iHeight;
						iHeight = 600;
						iWidth = iWidth * scaleFactor;
					}

					// Calcular coordenadas para centrar la imagen horizontalmente
					const xCenter = (pWidth - iWidth) / 2;

					// Verificar si hay suficiente espacio en la página actual para esta imagen
					const spaceNeeded = iHeight + verticalSpacing;
					if (currentY - spaceNeeded < pageMargin) {
						currentPage = pdfDoc.addPage(PageSizes.A4);
						currentY = pHeight - 50; // reiniciar posición Y cerca de la parte superior de la nueva página
					}

					currentPage.drawImage(embeddedImage, {
						x: xCenter,
						y: currentY - iHeight,
						width: iWidth,
						height: iHeight
					});

					currentY = currentY - iHeight - verticalSpacing;
				} catch (error) {
					console.error(`Error al procesar la imagen ${imageSrc}:`, error);
					continue;
				}
			}
		}
	}

	for (const obj of objsWithOnlyPdfs) {
		// Texto que se dibujará en la esquina superior izquierda
		const ordenText = `Reclamo: ${obj.reclamoId}-${obj.orden}`;

		for (const url of obj.archivos) {
			// Obtener el PDF desde la URL
			const respuesta = await fetch(url as RequestInfo);
			const pdfBytes = await respuesta.arrayBuffer();

			// Cargar el PDF con PDFDocument.load
			const pdfActual = await PDFDocument.load(pdfBytes);

			// Obtener el conteo total de páginas
			const totalPaginas = pdfActual.getPageCount();

			// Crear un arreglo con los índices de las páginas del PDF actual
			const indicesPaginas = Array.from({ length: totalPaginas }, (_, i) => i);

			// Copiar las páginas al documento principal
			const paginasCopiadas = await pdfDoc.copyPages(pdfActual, indicesPaginas);

			// Ajustar cada página copiada y dibujar el texto
			for (const paginaCopiada of paginasCopiadas) {
				// Dimensiones originales de la página
				const { width: origWidth, height: origHeight } = paginaCopiada.getSize();

				// Calcular factor de escala para que el ancho sea igual a la variable global `width`
				const scaleFactor = PageSizes.A4[0] / origWidth;
				const newHeight = origHeight * scaleFactor;
				paginaCopiada.scale(scaleFactor, scaleFactor);

				// Ajustar el tamaño de la página copiada
				paginaCopiada.setSize(PageSizes.A4[0], newHeight);

				// Agregar la página copiada al documento principal
				const nuevaPagina = pdfDoc.addPage(paginaCopiada);
				const { height } = nuevaPagina.getSize();

				const textWidth = font.widthOfTextAtSize(ordenText, 16);

				nuevaPagina.drawRectangle({
					x: 50,
					y: height - 20,
					width: textWidth + 10,
					height: 20,
					color: rgb(0.95, 0.95, 0.95) // Color de fondo (gris claro)
				});

				// Ahora escribimos el texto encima del rectángulo
				nuevaPagina.drawText(ordenText, {
					x: 54,
					y: height - 20 + 4, // 4 px desde la parte inferior del rectángulo
					size: 16,
					font: font, // Asegurarse de tener la fuente configurada
					color: rgb(0, 0, 0)
				});
			}
		}
	}
}

async function convertImageToJpeg(imageUrl: string): Promise<ArrayBuffer> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'Anonymous'; // Necesario para evitar problemas de CORS

		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				reject(new Error('No se pudo obtener el contexto del canvas'));
				return;
			}
			ctx.drawImage(img, 0, 0);
			canvas.toBlob((blob) => {
				if (!blob) {
					reject(new Error('No se pudo convertir la imagen a Blob'));
					return;
				}
				const reader = new FileReader();
				reader.onloadend = () => {
					if (reader.result instanceof ArrayBuffer) {
						resolve(reader.result);
					} else {
						reject(new Error('No se pudo convertir el Blob a ArrayBuffer'));
					}
				};
				reader.onerror = () => {
					reject(new Error('Error al leer el Blob'));
				};
				reader.readAsArrayBuffer(blob);
			}, 'image/jpeg');
		};

		img.onerror = () => {
			reject(new Error(`No se pudo cargar la imagen desde la URL: ${imageUrl}`));
		};

		img.src = imageUrl;
	});
}
