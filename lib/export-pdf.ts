// lib/export-pdf.ts
// Export d'un deck de slides en PDF via html2canvas + jsPDF
// Chaque slide est capturée comme image haute résolution puis ajoutée au PDF

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { MIA } from './charter';

const SLIDE_W = MIA.slide.width;   // 1280
const SLIDE_H = MIA.slide.height;  // 720

/**
 * Exporte un tableau d'éléments DOM (slides rendues) en PDF.
 * Chaque élément doit être rendu à 1280x720 dans le DOM.
 * @param slideElements - Les éléments DOM contenant chaque slide
 * @param filename - Nom du fichier PDF
 * @param onProgress - Callback de progression (slideIndex, total)
 */
export async function exportSlidesToPDF(
  slideElements: HTMLElement[],
  filename: string = 'presentation.pdf',
  onProgress?: (current: number, total: number) => void,
): Promise<void> {
  // PDF en paysage 16:9
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [SLIDE_W, SLIDE_H],
    hotfixes: ['px_scaling'],
  });

  for (let i = 0; i < slideElements.length; i++) {
    if (onProgress) onProgress(i, slideElements.length);

    const el = slideElements[i];

    // Capture le slide en canvas avec une résolution 2x pour la netteté
    const canvas = await html2canvas(el, {
      width: SLIDE_W,
      height: SLIDE_H,
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');

    if (i > 0) {
      pdf.addPage([SLIDE_W, SLIDE_H], 'landscape');
    }

    pdf.addImage(imgData, 'PNG', 0, 0, SLIDE_W, SLIDE_H);
  }

  if (onProgress) onProgress(slideElements.length, slideElements.length);

  pdf.save(filename);
}
