import jsPDF from "jspdf";
import "jspdf-autotable";
import { formatDateTime } from "./formatters";

/**
 * Genera un PDF de la lista de materiales
 * @param {Array} materials - Lista de materiales
 * @param {Object} options - Opciones de filtrado
 */
export const exportMaterialsToPDF = (materials, options = {}) => {
  const doc = new jsPDF();
  const { categoryFilter, statusFilter } = options;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(222, 89, 31); // Brand color
  doc.text("Control de Stock - Inventario de Materiales", 14, 20);

  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado: ${formatDateTime(new Date())}`, 14, 28);

  // Filtros aplicados
  let yPos = 35;
  if (categoryFilter && categoryFilter !== "all") {
    doc.text(`Categoría: ${categoryFilter}`, 14, yPos);
    yPos += 5;
  }
  if (statusFilter && statusFilter !== "all") {
    doc.text(`Estado: ${statusFilter}`, 14, yPos);
    yPos += 5;
  }

  // Tabla de materiales
  const tableData = materials.map((mat) => [
    mat.code || "-",
    mat.name || "-",
    mat.category || "-",
    mat.quantity || 0,
    mat.quantityCommitted || 0,
    mat.location || "-",
    mat.status || "-",
  ]);

  doc.autoTable({
    startY: yPos + 5,
    head: [
      [
        "Código",
        "Nombre",
        "Categoría",
        "Stock",
        "Comprometido",
        "Ubicación",
        "Estado",
      ],
    ],
    body: tableData,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [222, 89, 31],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 10 },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Resumen
  doc.setPage(1);
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.text(`Total de materiales: ${materials.length}`, 14, finalY);

  const totalStock = materials.reduce(
    (sum, mat) => sum + (mat.quantity || 0),
    0
  );
  doc.text(`Stock total: ${totalStock} unidades`, 14, finalY + 6);

  // Guardar
  doc.save(
    `inventario-materiales-${new Date().toISOString().split("T")[0]}.pdf`
  );
};

/**
 * Genera un PDF del historial de movimientos
 * @param {Array} movements - Lista de movimientos
 * @param {Object} options - Opciones de filtrado
 */
export const exportMovementsToPDF = (movements) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(222, 89, 31);
  doc.text("Control de Stock - Historial de Movimientos", 14, 20);

  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado: ${formatDateTime(new Date())}`, 14, 28);

  // Tabla de movimientos
  const tableData = movements.map((mov) => [
    formatDateTime(mov.createdAt?.toDate?.() || new Date()),
    mov.type || "-",
    mov.materialName || "-",
    mov.quantity || 0,
    mov.fromLocation || "-",
    mov.toLocation || "-",
    mov.createdByName || "-",
  ]);

  doc.autoTable({
    startY: 35,
    head: [
      ["Fecha", "Tipo", "Material", "Cant.", "Origen", "Destino", "Usuario"],
    ],
    body: tableData,
    styles: {
      fontSize: 7,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [222, 89, 31],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 32 },
      1: { cellWidth: 22 },
      2: { cellWidth: 40 },
      3: { cellWidth: 15 },
      4: { cellWidth: 30 },
      5: { cellWidth: 30 },
      6: { cellWidth: 25 },
    },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Resumen
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setPage(1);
  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.text(`Total de movimientos: ${movements.length}`, 14, finalY);

  // Guardar
  doc.save(
    `historial-movimientos-${new Date().toISOString().split("T")[0]}.pdf`
  );
};

/**
 * Genera un PDF de reporte de material específico
 * @param {Object} material - Material
 * @param {Array} movements - Movimientos del material
 */
export const exportMaterialReportPDF = (material, movements = []) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(222, 89, 31);
  doc.text("Reporte de Material", 14, 20);

  // Info del material
  doc.setFontSize(12);
  doc.setTextColor(50);
  doc.text(`${material.name}`, 14, 35);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Código: ${material.code}`, 14, 42);
  doc.text(`Categoría: ${material.category}`, 14, 48);
  doc.text(`Ubicación: ${material.location}`, 14, 54);

  // Stats
  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.text(`Stock Disponible: ${material.quantity || 0}`, 120, 42);
  doc.text(`Comprometido: ${material.quantityCommitted || 0}`, 120, 48);
  doc.text(`Mantenimiento: ${material.quantityMaintenance || 0}`, 120, 54);

  // Historial de movimientos
  if (movements.length > 0) {
    doc.setFontSize(12);
    doc.text("Historial de Movimientos", 14, 65);

    const tableData = movements.map((mov) => [
      formatDateTime(mov.createdAt?.toDate?.() || new Date()),
      mov.type || "-",
      mov.quantity || 0,
      mov.reason || "-",
      mov.createdByName || "-",
    ]);

    doc.autoTable({
      startY: 70,
      head: [["Fecha", "Tipo", "Cantidad", "Motivo", "Usuario"]],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [222, 89, 31],
        textColor: [255, 255, 255],
      },
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Generado: ${formatDateTime(new Date())} - Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  doc.save(
    `reporte-${material.code}-${new Date().toISOString().split("T")[0]}.pdf`
  );
};
