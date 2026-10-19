/**
 * Etiquetas con código QR para pegar en los equipos.
 * El QR contiene el código del material: el escáner de la app lo reconoce.
 *
 * Formatos:
 *  - "a4":     hoja A4 de 3 × 8 etiquetas (63,5 × 33,9 mm, hojas adhesivas estándar)
 *  - "single": una etiqueta de 62 × 29 mm por página (impresoras de etiquetas)
 */
export const LABEL_FORMATS = {
  a4: { label: "Hoja A4 · 24 etiquetas (3 × 8)", cols: 3, rows: 8, w: 63.5, h: 33.9 },
  single: { label: "Etiqueta individual 62 × 29 mm", w: 62, h: 29 },
};

const A4 = { w: 210, h: 297, marginX: 7.2, marginY: 13.1, gapX: 2.5, gapY: 0 };

const fitText = (doc, text, maxWidth, maxLines) => {
  const lines = doc.splitTextToSize(String(text || ""), maxWidth);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  kept[maxLines - 1] = `${kept[maxLines - 1].replace(/.{0,2}$/, "")}…`;
  return kept;
};

const drawLabel = (doc, x, y, w, h, material, qrDataUrl, categoryLabel) => {
  const pad = 2.5;
  const qr = h - pad * 2;
  doc.addImage(qrDataUrl, "PNG", x + pad, y + pad, qr, qr);

  const tx = x + pad * 2 + qr;
  const tw = w - (tx - x) - pad;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(17, 24, 39);
  const nameLines = fitText(doc, material.name, tw, 2);
  doc.text(nameLines, tx, y + pad + 3.5);

  doc.setFont("courier", "bold");
  doc.setFontSize(10);
  doc.text(String(material.code || ""), tx, y + pad + 3.5 + nameLines.length * 3.8 + 1.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 105, 115);
  const meta = [categoryLabel, material.location].filter(Boolean).join(" · ");
  doc.text(fitText(doc, meta, tw, 2), tx, y + h - pad - 3);
};

/**
 * @param {Array} materials - materiales a imprimir
 * @param {"a4"|"single"} format
 * @param {(key:string)=>string} getCategoryLabel
 */
export const generateLabelsPdf = async (materials, format, getCategoryLabel = (k) => k) => {
  const [{ jsPDF }, QRCode] = await Promise.all([import("jspdf"), import("qrcode")]);
  const spec = LABEL_FORMATS[format];

  const qrs = await Promise.all(
    materials.map((m) =>
      QRCode.toDataURL(String(m.code), { errorCorrectionLevel: "M", margin: 0, width: 320 })
    )
  );

  let doc;
  if (format === "single") {
    doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [spec.h, spec.w] });
    materials.forEach((m, i) => {
      if (i > 0) doc.addPage([spec.h, spec.w], "landscape");
      drawLabel(doc, 0, 0, spec.w, spec.h, m, qrs[i], getCategoryLabel(m.category));
    });
  } else {
    doc = new jsPDF({ unit: "mm", format: "a4" });
    const perPage = spec.cols * spec.rows;
    materials.forEach((m, i) => {
      if (i > 0 && i % perPage === 0) doc.addPage();
      const slot = i % perPage;
      const col = slot % spec.cols;
      const row = Math.floor(slot / spec.cols);
      const x = A4.marginX + col * (spec.w + A4.gapX);
      const y = A4.marginY + row * (spec.h + A4.gapY);
      // Guía de corte muy tenue (no se nota sobre hojas precortadas)
      doc.setDrawColor(225, 227, 231);
      doc.setLineWidth(0.1);
      doc.rect(x, y, spec.w, spec.h);
      drawLabel(doc, x, y, spec.w, spec.h, m, qrs[i], getCategoryLabel(m.category));
    });
  }

  const date = new Date().toISOString().split("T")[0];
  const name =
    materials.length === 1 ? `etiqueta-${materials[0].code}` : `etiquetas-${materials.length}`;
  doc.save(`${name}-${date}.pdf`);
};
