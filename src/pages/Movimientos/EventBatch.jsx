import React, { useMemo, useState } from "react";
import { Plus, ScanLine, Search, Trash2, PackageCheck, PackageMinus } from "lucide-react";
import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { COLLECTIONS, MOVEMENT_TYPES } from "../../constants";
import { OFFLINE_MESSAGE } from "../../hooks/useOnlineStatus";
import { useMovements } from "../../hooks/useFirestore";
import { getEventPendingItems, getPendingByProject } from "../../utils/analytics";
import { notifyLowStock } from "../../utils/alerts";
import { computeMovement, getStock, normalize } from "../../utils/stock";
import Modal from "../../components/Modal/Modal";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import EmptyState from "../../components/EmptyState/EmptyState";
import BarcodeScanner from "../../components/BarcodeScanner/BarcodeScanner";

// Una transacción admite hasta 500 escrituras (2 por equipo)
const MAX_ITEMS = 150;

/**
 * Registra en una sola transacción las salidas (o devoluciones) de varios
 * equipos para un mismo evento. Si una línea no es válida, no se guarda nada.
 *
 * mode: "out" (salida) | "return" (devolución)
 */
const EventBatch = ({ mode, materials, initialEvent = "", onClose }) => {
  const { currentUser, userData } = useAuth();
  // Historial completo: lo pendiente de un evento puede ser antiguo
  const { movements } = useMovements();
  const isOut = mode === "out";

  const [eventName, setEventName] = useState(initialEvent);
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState([]); // salida: [{ materialId, quantity }]
  const [returned, setReturned] = useState({}); // devolución: { materialId: cantidad }
  const [search, setSearch] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [saving, setSaving] = useState(false);

  const byId = useMemo(() => new Map(materials.map((m) => [m.id, m])), [materials]);

  const events = useMemo(() => getPendingByProject(movements), [movements]);
  const openEvents = events.filter((e) => e.pending > 0);

  const pendingItems = useMemo(
    () => (!isOut && eventName.trim() ? getEventPendingItems(movements, eventName) : []),
    [isOut, eventName, movements]
  );

  // ----- Salida: armar la lista -----
  const addMaterial = (material) => {
    if (!material) return;
    if (lines.some((l) => l.materialId === material.id)) {
      toast(`${material.name} ya está en la lista`);
      return;
    }
    if (lines.length >= MAX_ITEMS) {
      toast.error(`Máximo ${MAX_ITEMS} equipos por registro`);
      return;
    }
    setLines((prev) => [...prev, { materialId: material.id, quantity: "1" }]);
    setSearch("");
  };

  const suggestions = useMemo(() => {
    const term = normalize(search.trim());
    if (!term) return [];
    return materials
      .filter((m) => normalize(`${m.name} ${m.code}`).includes(term))
      .slice(0, 6);
  }, [materials, search]);

  const handleScanned = (code) => {
    setShowScanner(false);
    const match = materials.find((m) => normalize(m.code) === normalize(code));
    if (match) addMaterial(match);
    else toast.error(`No hay ningún material con el código ${code}`);
  };

  const lineError = (line) => {
    const material = byId.get(line.materialId);
    if (!material) return "El material ya no existe";
    try {
      computeMovement(material, MOVEMENT_TYPES.SALIDA, line.quantity);
      return null;
    } catch (error) {
      return error.message;
    }
  };

  // ----- Devolución: cantidades por defecto = todo lo pendiente -----
  const returnQty = (item) => returned[item.materialId] ?? String(item.pending);
  const returnError = (item) => {
    const n = Number(returnQty(item));
    if (!Number.isInteger(n) || n < 0) return "Debe ser un entero ≥ 0";
    if (n > item.pending) return `Sólo faltan ${item.pending}`;
    return null;
  };

  const outErrors = lines.map(lineError);
  const returnErrors = pendingItems.map(returnError);
  const returnTotal = pendingItems.reduce(
    (acc, item, i) => acc + (returnErrors[i] ? 0 : Number(returnQty(item))),
    0
  );
  const hasErrors = isOut ? outErrors.some(Boolean) : returnErrors.some(Boolean);
  const canSubmit =
    eventName.trim() && !hasErrors && (isOut ? lines.length > 0 : returnTotal > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventName.trim()) return toast.error("Indica el nombre del evento");
    if (!canSubmit) return toast.error("Revisa las cantidades marcadas");
    if (!navigator.onLine) return toast.error(OFFLINE_MESSAGE);

    const type = isOut ? MOVEMENT_TYPES.SALIDA : MOVEMENT_TYPES.DEVOLUCION;
    const items = isOut
      ? lines.map((l) => ({ materialId: l.materialId, quantity: Number(l.quantity) }))
      : pendingItems
          .map((item) => ({ materialId: item.materialId, quantity: Number(returnQty(item)) }))
          .filter((item) => item.quantity > 0);

    setSaving(true);
    try {
      const changes = [];
      await runTransaction(db, async (tx) => {
        changes.length = 0;
        // En una transacción, primero todas las lecturas…
        const refs = items.map((it) => doc(db, COLLECTIONS.MATERIALS, it.materialId));
        const snaps = [];
        for (const ref of refs) snaps.push(await tx.get(ref));

        // …y después todas las escrituras
        snaps.forEach((snap, i) => {
          if (!snap.exists()) throw new Error("Uno de los materiales ya no existe");
          const fresh = snap.data();
          const result = computeMovement(fresh, type, items[i].quantity);
          tx.update(refs[i], { ...result.updates, updatedAt: serverTimestamp() });
          tx.set(doc(collection(db, COLLECTIONS.MOVEMENTS)), {
            materialId: snap.id,
            materialName: fresh.name || "",
            materialCode: fresh.code || "",
            type,
            quantity: items[i].quantity,
            previousQuantity: result.previousQuantity,
            newQuantity: result.newQuantity,
            reason: isOut ? "Salida a evento" : "Regreso de evento",
            project: eventName.trim(),
            notes: notes.trim(),
            fromLocation: fresh.location || "",
            toLocation: fresh.location || "",
            createdAt: serverTimestamp(),
            createdBy: currentUser?.uid || "",
            createdByName: userData?.name || "Usuario",
          });
          changes.push({ before: fresh, after: { ...fresh, ...result.updates } });
        });
      });

      const units = items.reduce((acc, it) => acc + it.quantity, 0);
      toast.success(
        isOut
          ? `Salida registrada: ${units} unidades de ${items.length} equipos para «${eventName.trim()}»`
          : `Devolución registrada: ${units} unidades de «${eventName.trim()}»`
      );
      if (isOut) notifyLowStock(changes);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error.code === "permission-denied"
          ? "No tienes permisos para registrar movimientos"
          : error.message || "No se pudo registrar"
      );
      setSaving(false);
    }
  };

  return (
    <>
      <Modal
        isOpen
        onClose={saving ? () => {} : onClose}
        title={isOut ? "Salida a evento" : "Devolución de evento"}
        subtitle={
          isOut
            ? "Arma la lista de equipos y regístralos todos juntos"
            : "Marca lo que volvió; el resto queda pendiente"
        }
        size="lg"
        closeOnBackdrop={false}
      >
        <form onSubmit={handleSubmit} className="form-stack" noValidate>
          {isOut ? (
            <Input
              label="Evento / proyecto"
              name="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              list="batch-events"
              placeholder="Ej: Festival Primavera 2026"
              required
            />
          ) : (
            <Input
              type="select"
              label="Evento con material pendiente"
              name="eventName"
              value={eventName}
              onChange={(e) => {
                setEventName(e.target.value);
                setReturned({});
              }}
              required
            >
              <option value="">
                {openEvents.length ? "Seleccionar evento..." : "No hay eventos con material pendiente"}
              </option>
              {openEvents.map((ev) => (
                <option key={ev.project} value={ev.project}>
                  {ev.project} — faltan {ev.pending} unid.
                </option>
              ))}
            </Input>
          )}
          <datalist id="batch-events">
            {events.map((ev) => (
              <option key={ev.project} value={ev.project} />
            ))}
          </datalist>

          {isOut ? (
            <>
              <div className="batch-picker">
                <Input
                  name="batchSearch"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addMaterial(suggestions[0]);
                    }
                  }}
                  placeholder="Buscar equipo por nombre o código y pulsar Enter..."
                  icon={Search}
                  autoComplete="off"
                  aria-label="Agregar equipo"
                  suffix={
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={ScanLine}
                      onClick={() => setShowScanner(true)}
                      aria-label="Escanear equipo"
                      title="Escanear código"
                    />
                  }
                />
                {suggestions.length > 0 && (
                  <ul className="batch-suggestions">
                    {suggestions.map((m) => (
                      <li key={m.id}>
                        <button type="button" onClick={() => addMaterial(m)}>
                          <Plus size={14} />
                          <span className="cell-title">{m.name}</span>
                          <span className="cell-sub mono">{m.code}</span>
                          <span className="batch-avail">disp. {getStock(m).available}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {lines.length === 0 ? (
                <EmptyState
                  compact
                  icon={PackageMinus}
                  title="Todavía no hay equipos en la lista"
                  description="Búscalos o escanéalos para agregarlos."
                />
              ) : (
                <div className="table-wrap">
                  <table className="table batch-table">
                    <thead>
                      <tr>
                        <th>Equipo</th>
                        <th className="num">Disponible</th>
                        <th className="num">Cantidad</th>
                        <th aria-label="Quitar" />
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line, i) => {
                        const m = byId.get(line.materialId);
                        return (
                          <tr key={line.materialId}>
                            <td>
                              <span className="cell-title">{m?.name || "—"}</span>
                              <span className="cell-sub mono">{m?.code}</span>
                              {outErrors[i] && <span className="batch-error">{outErrors[i]}</span>}
                            </td>
                            <td className="num">{m ? getStock(m).available : "—"}</td>
                            <td className="num">
                              <input
                                className={`input batch-qty ${outErrors[i] ? "input-error" : ""}`}
                                type="number"
                                inputMode="numeric"
                                min="1"
                                value={line.quantity}
                                onChange={(e) =>
                                  setLines((prev) =>
                                    prev.map((l) =>
                                      l.materialId === line.materialId ? { ...l, quantity: e.target.value } : l
                                    )
                                  )
                                }
                                aria-label={`Cantidad de ${m?.name}`}
                              />
                            </td>
                            <td className="num">
                              <Button
                                variant="danger-ghost"
                                size="sm"
                                icon={Trash2}
                                onClick={() =>
                                  setLines((prev) => prev.filter((l) => l.materialId !== line.materialId))
                                }
                                aria-label="Quitar de la lista"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : !eventName ? null : pendingItems.length === 0 ? (
            <EmptyState compact icon={PackageCheck} title="Este evento no tiene material pendiente" />
          ) : (
            <div className="table-wrap">
              <table className="table batch-table">
                <thead>
                  <tr>
                    <th>Equipo</th>
                    <th className="num">Salieron</th>
                    <th className="num">Volvieron</th>
                    <th className="num">Vuelve ahora</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingItems.map((item, i) => (
                    <tr key={item.materialId}>
                      <td>
                        <span className="cell-title">{item.materialName}</span>
                        <span className="cell-sub mono">{item.materialCode}</span>
                        {returnErrors[i] && <span className="batch-error">{returnErrors[i]}</span>}
                      </td>
                      <td className="num">{item.out}</td>
                      <td className="num">{item.returned}</td>
                      <td className="num">
                        <input
                          className={`input batch-qty ${returnErrors[i] ? "input-error" : ""}`}
                          type="number"
                          inputMode="numeric"
                          min="0"
                          max={item.pending}
                          value={returnQty(item)}
                          onChange={(e) =>
                            setReturned((prev) => ({ ...prev, [item.materialId]: e.target.value }))
                          }
                          aria-label={`Unidades de ${item.materialName} que vuelven`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Input
            label="Notas"
            type="textarea"
            name="batchNotes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={isOut ? "Opcional: responsable, transporte..." : "Opcional: estado del material al volver..."}
          />

          <div className="form-actions">
            <Button variant="secondary" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving} disabled={!canSubmit}>
              {isOut
                ? `Registrar salida (${lines.length} ${lines.length === 1 ? "equipo" : "equipos"})`
                : `Registrar devolución (${returnTotal} unid.)`}
            </Button>
          </div>
        </form>
      </Modal>

      {showScanner && (
        <BarcodeScanner
          title="Agregar equipo por código"
          onScan={handleScanned}
          onClose={() => setShowScanner(false)}
        />
      )}
    </>
  );
};

export default EventBatch;
