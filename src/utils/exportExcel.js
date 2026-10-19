/**
 * Exporta filas a un archivo Excel (.xlsx).
 * La librería se carga bajo demanda para no engordar el bundle inicial.
 *
 * @param {Array<object>} rows - Objetos { "Columna": valor }
 * @param {string} fileName - Nombre base del archivo (sin extensión)
 * @param {string} sheetName - Nombre de la hoja
 */
export const exportToExcel = async (rows, fileName, sheetName = "Datos") => {
  const XLSX = await import("xlsx");
  const sheet = XLSX.utils.json_to_sheet(rows);

  // Ancho de columnas aproximado según el contenido
  const headers = Object.keys(rows[0] || {});
  sheet["!cols"] = headers.map((h) => ({
    wch: Math.min(
      50,
      Math.max(h.length, ...rows.map((r) => String(r[h] ?? "").length)) + 2
    ),
  }));

  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, sheetName);
  const date = new Date().toISOString().split("T")[0];
  XLSX.writeFile(book, `${fileName}-${date}.xlsx`);
};
