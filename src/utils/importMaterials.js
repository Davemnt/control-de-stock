import { DEFAULTS, MATERIAL_STATUS, STATUS_LABELS, VALIDATION } from "../constants";
import { normalize } from "./stock";

/**
 * Importación de materiales desde hojas de cálculo con CUALQUIER formato:
 *  1. readSpreadsheet: lee la hoja y detecta la fila de encabezados
 *     (aunque haya títulos o filas vacías arriba).
 *  2. guessMapping: adivina qué columna es cada dato; el usuario puede corregirlo
 *     y la elección se recuerda por formato de archivo (rememberMapping).
 *  3. validateImport: valida cada fila y decide si crea, actualiza o descarta.
 */

// Campos que se pueden importar, en el orden en que se muestran
export const IMPORT_FIELDS = [
  { key: "name", label: "Nombre", required: true },
  { key: "code", label: "Código", hint: "Si no hay, se busca por nombre o se genera" },
  { key: "quantity", label: "Cantidad disponible" },
  { key: "category", label: "Categoría" },
  { key: "subcategory", label: "Subcategoría" },
  { key: "location", label: "Ubicación" },
  { key: "status", label: "Estado" },
  { key: "minStock", label: "Stock mínimo" },
  { key: "notes", label: "Notas" },
];

// Columnas de la plantilla (en este orden)
export const IMPORT_COLUMNS = [
  "Código",
  "Nombre",
  "Categoría",
  "Subcategoría",
  "Ubicación",
  "Estado",
  "Disponible",
  "Stock mínimo",
  "Notas",
];

// Encabezados habituales para cada campo (sin tildes ni mayúsculas)
const HEADER_ALIASES = {
  code: ["codigo", "cod", "code", "sku", "referencia", "ref", "id", "item", "codigo interno", "nro", "numero"],
  name: ["nombre", "name", "material", "descripcion", "articulo", "producto", "equipo", "detalle", "item descripcion"],
  category: ["categoria", "category", "rubro", "tipo", "familia", "grupo", "linea"],
  subcategory: ["subcategoria", "subcategory", "subrubro", "subfamilia", "modelo", "marca"],
  location: ["ubicacion", "location", "deposito", "almacen", "lugar", "sector"],
  status: ["estado", "status", "condicion"],
  quantity: ["disponible", "disponibles", "cantidad", "cant", "stock", "quantity", "unidades", "existencia", "existencias", "qty", "stock disponible", "cantidad disponible"],
  minStock: ["stock minimo", "minimo", "min", "stock min", "punto de pedido"],
  notes: ["notas", "observaciones", "obs", "notes", "comentarios"],
};

const clean = (text) => normalize(text).replace(/[._:#()]/g, " ").replace(/\s+/g, " ").trim();

/** Adivina el mapeo { campo: encabezado } a partir de los encabezados */
export const guessMapping = (headers) => {
  const mapping = {};
  const used = new Set();
  // Primero coincidencias exactas, después parciales ("Cant. disponible")
  for (const exact of [true, false]) {
    for (const field of Object.keys(HEADER_ALIASES)) {
      if (mapping[field]) continue;
      const header = headers.find((h) => {
        if (used.has(h)) return false;
        const c = clean(h);
        return HEADER_ALIASES[field].some((alias) =>
          exact ? c === alias : c.split(" ").includes(alias) || c.startsWith(`${alias} `)
        );
      });
      if (header) {
        mapping[field] = header;
        used.add(header);
      }
    }
  }
  return mapping;
};

// ---------- Memoria del mapeo por formato de archivo ----------
const signatureOf = (headers) => headers.map(clean).sort().join("|");
const STORAGE_KEY = "cs-import-mappings";

export const recallMapping = (headers) => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")[signatureOf(headers)];
    // Sólo se usa si todas las columnas recordadas siguen existiendo
    if (saved && Object.values(saved).every((h) => headers.includes(h))) return saved;
  } catch {
    // almacenamiento no disponible
  }
  return null;
};

export const rememberMapping = (headers, mapping) => {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    all[signatureOf(headers)] = mapping;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // almacenamiento no disponible: se volverá a adivinar
  }
};

// ---------- Validación ----------
const parseCount = (value) => {
  const text = String(value ?? "").trim();
  if (text === "") return { empty: true, value: null };
  // Admite "1.200" o "1,200" como miles y "12,0" como decimal entero
  const normalized = text.replace(/\s/g, "").replace(/[.,](?=\d{3}(\D|$))/g, "").replace(",", ".");
  const n = Number(normalized);
  return Number.isInteger(n) && n >= 0 ? { empty: false, value: n } : { empty: false, value: NaN };
};

const codePrefix = (category) =>
  (normalize(category).replace(/[^a-z]/g, "").slice(0, 3) || "mat").toUpperCase();

/**
 * Valida las filas según el mapeo elegido.
 *
 * @returns {{ rows, newCategories }}
 *   rows: [{ line, data, hasQuantity, generatedCode, errors, existing, action }]
 *   action: "create" | "update" | "error"
 */
export const validateImport = (rawRows, { materials, categories, mapping }) => {
  const byCode = new Map(materials.map((m) => [normalize(m.code), m]));
  const byName = new Map();
  materials.forEach((m) => {
    const key = normalize(m.name);
    // Si dos materiales comparten nombre, no se puede identificar por nombre
    byName.set(key, byName.has(key) ? null : m);
  });

  const categoryByName = new Map();
  categories.forEach((c) => {
    categoryByName.set(normalize(c.key), c.key);
    categoryByName.set(normalize(c.label), c.key);
  });
  const statusByName = new Map();
  Object.entries(STATUS_LABELS).forEach(([key, label]) => {
    statusByName.set(normalize(key), key);
    statusByName.set(normalize(label), key);
  });

  const takenCodes = new Set(materials.map((m) => normalize(m.code)));
  const seenCodes = new Set();
  const seenNames = new Set();
  const newCategories = new Map();
  const counters = {};

  const nextCode = (category) => {
    const prefix = codePrefix(category);
    let code;
    do {
      counters[prefix] = (counters[prefix] || 0) + 1;
      code = `${prefix}-${String(counters[prefix]).padStart(4, "0")}`;
    } while (takenCodes.has(normalize(code)));
    takenCodes.add(normalize(code));
    return code;
  };

  const rows = rawRows
    .map((raw, i) => {
      const get = (field) => (mapping[field] ? String(raw[mapping[field]] ?? "").trim() : "");
      const errors = [];

      if (Object.values(raw).every((v) => String(v ?? "").trim() === "")) return null;

      const name = get("name");
      let code = get("code");
      if (!name) errors.push("Falta el nombre");

      // Categoría: por nombre o identificador; si no existe se propone crearla
      const categoryText = get("category");
      let category = categoryText ? categoryByName.get(normalize(categoryText)) : "";
      if (categoryText && !category) {
        category = categoryText;
        newCategories.set(normalize(categoryText), categoryText);
      }

      // Material existente: por código si lo hay; si no, por nombre
      let existing = null;
      if (code) existing = byCode.get(normalize(code)) || null;
      else if (name) existing = byName.get(normalize(name)) || null;
      if (!category) category = existing?.category || categories[0]?.key || "";

      let generatedCode = false;
      if (!code && existing) code = existing.code;
      if (!code && name && !errors.length) {
        code = nextCode(category);
        generatedCode = true;
      }

      if (code.length > VALIDATION.CODE_MAX_LENGTH)
        errors.push(`Código de más de ${VALIDATION.CODE_MAX_LENGTH} caracteres`);
      const codeKey = normalize(code);
      if (code && seenCodes.has(codeKey)) errors.push("Código repetido en el archivo");
      if (code) seenCodes.add(codeKey);
      if (!mapping.code && name) {
        if (seenNames.has(normalize(name))) errors.push("Nombre repetido en el archivo");
        seenNames.add(normalize(name));
      }

      const statusText = get("status");
      const status = statusText ? statusByName.get(normalize(statusText)) : undefined;
      if (statusText && !status) errors.push(`Estado desconocido: "${statusText}"`);

      const quantity = parseCount(get("quantity"));
      if (Number.isNaN(quantity.value)) errors.push("La cantidad debe ser un entero ≥ 0");
      const minStock = parseCount(get("minStock"));
      if (Number.isNaN(minStock.value)) errors.push("El stock mínimo debe ser un entero ≥ 0");

      return {
        line: raw.__line ?? i + 2,
        data: {
          code,
          name,
          category,
          subcategory: get("subcategory"),
          location: get("location") || existing?.location || DEFAULTS.LOCATION,
          status: status || existing?.status || MATERIAL_STATUS.OPERATIVO,
          quantity: quantity.empty || Number.isNaN(quantity.value) ? 0 : quantity.value,
          minStock: minStock.empty || Number.isNaN(minStock.value) ? null : minStock.value,
          notes: get("notes").slice(0, VALIDATION.DESCRIPTION_MAX_LENGTH),
        },
        hasQuantity: !quantity.empty && !Number.isNaN(quantity.value),
        generatedCode,
        errors,
        existing,
        action: errors.length ? "error" : existing ? "update" : "create",
      };
    })
    .filter(Boolean);

  return { rows, newCategories: [...newCategories.values()] };
};

// ---------- Lectura del archivo ----------
const isTextCell = (v) => typeof v === "string" && v.trim() !== "" && Number.isNaN(Number(v));

/**
 * Lee un .xlsx / .xls / .csv. Devuelve las hojas disponibles y, para la
 * elegida, los encabezados detectados y las filas como objetos.
 */
export const readSpreadsheet = async (file, sheetName) => {
  const XLSX = await import("xlsx");
  const book = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const sheets = book.SheetNames;
  const name = sheetName && sheets.includes(sheetName) ? sheetName : sheets[0];
  const matrix = XLSX.utils.sheet_to_json(book.Sheets[name], {
    header: 1,
    defval: "",
    raw: false,
    blankrows: true,
  });

  // Fila de encabezados: entre las primeras 15, la que más celdas de texto tiene
  let headerIndex = 0;
  let best = -1;
  matrix.slice(0, 15).forEach((row, i) => {
    const score = row.filter(isTextCell).length;
    if (score > best) {
      best = score;
      headerIndex = i;
    }
  });

  const headerRow = matrix[headerIndex] || [];
  const headers = [];
  const columns = headerRow.map((cell, col) => {
    let h = String(cell ?? "").trim() || `Columna ${col + 1}`;
    while (headers.includes(h)) h = `${h} (${col + 1})`;
    headers.push(h);
    return h;
  });

  const rows = matrix.slice(headerIndex + 1).map((row, i) => {
    const obj = { __line: headerIndex + i + 2 };
    columns.forEach((h, col) => {
      obj[h] = row[col] ?? "";
    });
    return obj;
  });

  // Columnas sin encabezado y totalmente vacías no se ofrecen
  const usedHeaders = headers.filter(
    (h) => !h.startsWith("Columna ") || rows.some((r) => String(r[h]).trim() !== "")
  );

  return { sheets, sheet: name, headerLine: headerIndex + 1, headers: usedHeaders, rows };
};

/** Descarga la plantilla de importación (con hoja de ayuda) */
export const downloadImportTemplate = async (categories) => {
  const XLSX = await import("xlsx");
  const example = [
    {
      Código: "AUD-001",
      Nombre: "Consola Yamaha QL5",
      Categoría: categories[0]?.label || "Audio",
      Subcategoría: "Consolas",
      Ubicación: DEFAULTS.LOCATION,
      Estado: STATUS_LABELS[MATERIAL_STATUS.OPERATIVO],
      Disponible: 2,
      "Stock mínimo": 1,
      Notas: "Incluye flight case",
    },
  ];
  const sheet = XLSX.utils.json_to_sheet(example, { header: IMPORT_COLUMNS });
  sheet["!cols"] = IMPORT_COLUMNS.map((h) => ({ wch: Math.max(14, h.length + 2) }));

  const help = XLSX.utils.aoa_to_sheet([
    ["Campo", "Obligatorio", "Valores"],
    ["Nombre", "Sí", "Texto"],
    ["Código", "No", "Único por material (máx. 20 caracteres). Si falta, se busca por nombre o se genera"],
    ["Categoría", "No", categories.map((c) => c.label).join(", ")],
    ["Estado", "No", Object.values(STATUS_LABELS).join(", ")],
    ["Disponible", "No", "Número entero"],
    ["Stock mínimo", "No", "Número entero; vacío = valor por defecto"],
    [],
    ["También puedes subir tu propio Excel: la app te deja indicar qué columna es cada dato."],
  ]);
  help["!cols"] = [{ wch: 14 }, { wch: 12 }, { wch: 90 }];

  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Materiales");
  XLSX.utils.book_append_sheet(book, help, "Ayuda");
  XLSX.writeFile(book, "plantilla-importacion-materiales.xlsx");
};
