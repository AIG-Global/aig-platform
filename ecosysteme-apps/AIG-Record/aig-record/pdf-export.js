// ============================================================
// AIG Record — PDF export.
//
// Uses pdf-lib (MIT license, loaded from CDN), a real client-side PDF
// generation library — not a screenshot-to-PDF hack. Produces an
// actual multi-page, text-selectable PDF with the timestamped
// transcript and any bookmarks the user added during recording.
// ============================================================

(function () {
  "use strict";

  const PDFLIB_CDN = "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js";
  let pdfLibLoaded = false;

  function ensurePdfLib() {
    if (pdfLibLoaded) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = PDFLIB_CDN;
      script.onload = () => { pdfLibLoaded = true; resolve(); };
      script.onerror = () => reject(new Error("Couldn't load the PDF generation library — check your connection."));
      document.head.appendChild(script);
    });
  }

  const PAGE_WIDTH = 595.28; // A4
  const PAGE_HEIGHT = 841.89;
  const MARGIN = 50;
  const LINE_HEIGHT = 16;
  const BODY_SIZE = 10.5;

  function wrapText(text, font, size, maxWidth) {
    const words = text.split(/\s+/);
    const lines = [];
    let current = "";
    for (const word of words) {
      const test = current ? current + " " + word : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  /**
   * @param {{title: string, recordedAt: Date, durationSeconds: number, segments: Array<{start:number,end:number,text:string}>, bookmarks: Array<{atSeconds:number,label:string}>}} data
   * @returns {Promise<Uint8Array>}
   */
  async function generateTranscriptPdf(data) {
    await ensurePdfLib();
    const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

    let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN;

    function newPageIfNeeded(neededSpace) {
      if (y - neededSpace < MARGIN) {
        page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        y = PAGE_HEIGHT - MARGIN;
      }
    }

    page.drawText(data.title || "Meeting Transcript", { x: MARGIN, y, size: 18, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
    y -= 24;
    page.drawText("Recorded: " + data.recordedAt.toLocaleString(), { x: MARGIN, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
    y -= 14;
    const durMin = Math.floor(data.durationSeconds / 60);
    const durSec = Math.floor(data.durationSeconds % 60);
    page.drawText("Duration: " + durMin + "m " + durSec + "s", { x: MARGIN, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
    y -= 24;
    page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_WIDTH - MARGIN, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
    y -= 20;

    if (data.bookmarks && data.bookmarks.length) {
      page.drawText("Bookmarks", { x: MARGIN, y, size: 12, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
      y -= 16;
      for (const bm of data.bookmarks) {
        newPageIfNeeded(LINE_HEIGHT);
        const ts = window.AIGRecordTranscribe.formatTimestamp(bm.atSeconds);
        page.drawText("* [" + ts + "] " + bm.label, { x: MARGIN, y, size: BODY_SIZE, font, color: rgb(0.72, 0.5, 0.15) });
        y -= LINE_HEIGHT;
      }
      y -= 12;
      newPageIfNeeded(20);
      page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_WIDTH - MARGIN, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
      y -= 20;
    }

    page.drawText("Transcript", { x: MARGIN, y, size: 12, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
    y -= 18;

    const maxTextWidth = PAGE_WIDTH - MARGIN * 2 - 55;
    for (const seg of data.segments) {
      const ts = window.AIGRecordTranscribe.formatTimestamp(seg.start);
      const lines = wrapText(seg.text, font, BODY_SIZE, maxTextWidth);
      newPageIfNeeded(LINE_HEIGHT * lines.length + 4);

      page.drawText("[" + ts + "]", { x: MARGIN, y, size: BODY_SIZE, font: boldFont, color: rgb(0.5, 0.5, 0.5) });
      lines.forEach((line, i) => {
        page.drawText(line, { x: MARGIN + 55, y: y - i * LINE_HEIGHT, size: BODY_SIZE, font, color: rgb(0.15, 0.15, 0.15) });
      });
      y -= LINE_HEIGHT * lines.length + 4;
    }

    return doc.save();
  }

  window.AIGRecordPdf = { generateTranscriptPdf };
})();
