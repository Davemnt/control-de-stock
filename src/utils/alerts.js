import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { STOCK_THRESHOLDS } from "../constants";
import { getStockLevel } from "./stock";
import { APP_NAME } from "../config/branding";

/**
 * Avisos por email de stock bajo.
 *
 * La app escribe en la colección `mail` con el formato de la extensión oficial
 * de Firebase "Trigger Email from Firestore", que es la que envía el correo.
 * Sin la extensión instalada, los documentos simplemente quedan en cola.
 * La configuración (activado y destinatarios) vive en system/alerts.
 */
export const ALERTS_DOC = ["system", "alerts"];

const escapeHtml = (text) =>
  String(text ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/**
 * @param {Array<{ before: object, after: object }>} changes - material antes y después
 */
export const notifyLowStock = async (changes) => {
  try {
    // Sólo los que CRUZAN el umbral (no se repite el aviso en cada movimiento)
    const crossed = changes.filter(({ before, after }) => {
      const prev = getStockLevel(before);
      const next = getStockLevel(after);
      return next !== "ok" && next !== prev;
    });
    if (!crossed.length) return;

    const settings = await getDoc(doc(db, ...ALERTS_DOC));
    const { enabled, emails = [] } = settings.exists() ? settings.data() : {};
    if (!enabled || !emails.length) return;

    const rows = crossed
      .map(({ after }) => {
        const level = getStockLevel(after);
        const min = after.minStock ?? STOCK_THRESHOLDS.LOW;
        return `<tr>
          <td style="padding:6px 10px;border-bottom:1px solid #eee"><strong>${escapeHtml(after.name)}</strong><br><span style="color:#888">${escapeHtml(after.code)}</span></td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${Number(after.quantity) || 0}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;color:${level === "out" ? "#d33a2c" : "#b45309"}">${level === "out" ? "Sin stock" : `Bajo (mín. ${min})`}</td>
        </tr>`;
      })
      .join("");

    await addDoc(collection(db, "mail"), {
      to: emails,
      createdAt: serverTimestamp(),
      message: {
        subject: `${APP_NAME}: ${crossed.length} ${crossed.length === 1 ? "material" : "materiales"} con stock bajo`,
        html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111">
          <p>Los siguientes materiales quedaron por debajo de su stock mínimo:</p>
          <table style="border-collapse:collapse;min-width:360px">
            <tr><th align="left" style="padding:6px 10px">Material</th><th align="right" style="padding:6px 10px">Disponible</th><th align="left" style="padding:6px 10px">Estado</th></tr>
            ${rows}
          </table>
          <p style="color:#888;font-size:12px">Aviso automático de ${escapeHtml(APP_NAME)}.</p>
        </div>`,
      },
    });
  } catch (error) {
    // El aviso nunca debe impedir registrar el movimiento
    console.warn("No se pudo encolar el aviso de stock bajo:", error);
  }
};
