import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Edit,
  Trash2,
  ScanLine,
  FileDown,
  FileSpreadsheet,
  QrCode,
  Upload,
  Package,
  MapPin,
  X,
  SearchX,
} from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useCategories, useMaterials } from "../../hooks/useFirestore";
import { COLLECTIONS, STATUS_LABELS } from "../../constants";
import { exportToExcel } from "../../utils/exportExcel";
import { getCategoryVisual } from "../../utils/categoryVisual";
import {
  getStock,
  getStockLevel,
  normalize,
  STOCK_LEVEL_LABELS,
  toDate,
} from "../../utils/stock";
import Layout from "../../components/Layout/Layout";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Badge from "../../components/Badge/Badge";
import PageHeader from "../../components/PageHeader/PageHeader";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loader from "../../components/Loader/Loader";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import BarcodeScanner from "../../components/BarcodeScanner/BarcodeScanner";
import MaterialForm from "./MaterialForm";
import MaterialDetail from "./MaterialDetail";
import ImportDialog from "./ImportDialog";
import LabelsDialog from "../../components/LabelsDialog/LabelsDialog";
import "./Materiales.css";

const PAGE_SIZE = 24;
const LEVEL_VARIANT = { out: "error", low: "warning", ok: "success" };

const STOCK_FILTERS = {
  all: "Todo el stock",
  alert: "Con alertas",
  low: "Stock bajo",
  out: "Sin stock",
  maintenance: "En mantenimiento",
};

const SORTS = {
  name: "Nombre (A-Z)",
  code: "Código",
  "stock-asc": "Menor stock",
  "stock-desc": "Mayor stock",
  recent: "Más recientes",
};

/** Foto del material o, si no tiene, icono de su categoría */
const MaterialMedia = ({ material }) => {
  const { icon: Icon, style } = getCategoryVisual(material.category);
  return (
    <div className={`material-media ${material.imageUrl ? "" : "cat-tint"}`} style={style}>
      {material.imageUrl ? (
        <img src={material.imageUrl} alt="" loading="lazy" />
      ) : (
        <Icon size={30} strokeWidth={1.6} />
      )}
    </div>
  );
};

const MaterialThumb = ({ material }) => {
  const { icon: Icon, style } = getCategoryVisual(material.category);
  return (
    <span className={`material-thumb ${material.imageUrl ? "" : "cat-tint"}`} style={style}>
      {material.imageUrl ? <img src={material.imageUrl} alt="" loading="lazy" /> : <Icon size={16} />}
    </span>
  );
};

const readViewMode = () => {
  try {
    return localStorage.getItem("materials-view") || "grid";
  } catch {
    return "grid";
  }
};

const Materiales = () => {
  const { isAdmin, isEmployee, isGuest } = useAuth();
  const { materials, loading } = useMaterials();
  const { categories, getLabel } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("buscar") || "");
  const [category, setCategory] = useState(searchParams.get("categoria") || "all");
  const [status, setStatus] = useState("all");
  const [stockFilter, setStockFilter] = useState(searchParams.get("stock") || "all");
  const [sort, setSort] = useState("name");
  const [viewMode, setViewMode] = useState(readViewMode);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const [formTarget, setFormTarget] = useState(null); // null | "new" | material
  const [toDelete, setToDelete] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const canCreate = isAdmin || isEmployee;
  const detailId = searchParams.get("ver");
  const detailMaterial = detailId ? materials.find((m) => m.id === detailId) : null;

  useEffect(() => {
    try {
      localStorage.setItem("materials-view", viewMode);
    } catch {
      // sin almacenamiento: no se recuerda la vista
    }
  }, [viewMode]);

  useEffect(() => setVisible(PAGE_SIZE), [search, category, status, stockFilter, sort]);

  // Búsqueda que llega desde el buscador global de la barra superior
  const searchParam = searchParams.get("buscar");
  useEffect(() => {
    if (searchParam !== null) setSearch(searchParam);
  }, [searchParam]);

  // Filtros que llegan por URL (desde el dashboard o la campana de alertas)
  const stockParam = searchParams.get("stock");
  const categoryParam = searchParams.get("categoria");
  useEffect(() => {
    if (stockParam) setStockFilter(stockParam);
  }, [stockParam]);
  useEffect(() => {
    if (categoryParam) setCategory(categoryParam);
  }, [categoryParam]);

  const openDetail = (id) => {
    const next = new URLSearchParams(searchParams);
    next.set("ver", id);
    setSearchParams(next);
  };

  const closeDetail = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("ver");
    setSearchParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    const term = normalize(search.trim());
    const list = materials.filter((m) => {
      if (term) {
        const haystack = normalize(
          [m.name, m.code, m.category, getLabel(m.category), m.subcategory, m.location, m.notes].join(" ")
        );
        if (!haystack.includes(term)) return false;
      }
      if (category !== "all" && m.category !== category) return false;
      if (status !== "all" && m.status !== status) return false;
      if (stockFilter !== "all") {
        const level = getStockLevel(m);
        if (stockFilter === "alert" && level === "ok") return false;
        if (stockFilter === "low" && level !== "low") return false;
        if (stockFilter === "out" && level !== "out") return false;
        if (stockFilter === "maintenance" && getStock(m).maintenance === 0) return false;
      }
      return true;
    });

    const sorted = [...list];
    switch (sort) {
      case "code":
        sorted.sort((a, b) => String(a.code).localeCompare(String(b.code), "es"));
        break;
      case "stock-asc":
        sorted.sort((a, b) => getStock(a).available - getStock(b).available);
        break;
      case "stock-desc":
        sorted.sort((a, b) => getStock(b).available - getStock(a).available);
        break;
      case "recent":
        sorted.sort((a, b) => (toDate(b.createdAt) || 0) - (toDate(a.createdAt) || 0));
        break;
      default:
        break; // ya viene ordenado por nombre
    }
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materials, categories, search, category, status, stockFilter, sort]);

  const hasFilters =
    search || category !== "all" || status !== "all" || stockFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
    setStockFilter("all");
    setSearchParams({}, { replace: true });
  };

  const handleScan = (code) => {
    setShowScanner(false);
    const match = materials.find((m) => normalize(m.code) === normalize(code));
    if (match) {
      openDetail(match.id);
    } else {
      setSearch(code);
      toast.error(`No hay ningún material con el código ${code}`);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.MATERIALS, toDelete.id));
      toast.success("Material eliminado");
      if (detailId === toDelete.id) closeDetail();
    } catch (error) {
      console.error("Error deleting material:", error);
      toast.error("No se pudo eliminar el material");
      throw error;
    }
  };

  const exportRows = () =>
    filtered.map((m) => {
      const s = getStock(m);
      return {
        Código: m.code,
        Nombre: m.name,
        Categoría: getLabel(m.category),
        Subcategoría: m.subcategory || "",
        Ubicación: m.location || "",
        Estado: STATUS_LABELS[m.status] || m.status,
        Disponible: s.available,
        "En uso": s.committed,
        Mantenimiento: s.maintenance,
        Total: s.total,
        Notas: m.notes || "",
      };
    });

  const handleExportExcel = async () => {
    if (filtered.length === 0) return toast.error("No hay materiales para exportar");
    try {
      await exportToExcel(exportRows(), "inventario-materiales", "Inventario");
      toast.success("Excel generado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo generar el Excel");
    }
  };

  const handleExportPDF = async () => {
    if (filtered.length === 0) return toast.error("No hay materiales para exportar");
    try {
      const { exportMaterialsToPDF } = await import("../../utils/pdfExport");
      exportMaterialsToPDF(
        filtered.map((m) => ({
          ...m,
          category: getLabel(m.category),
          status: STATUS_LABELS[m.status] || m.status,
        })),
        {
          categoryFilter: category !== "all" ? getLabel(category) : "all",
          statusFilter: status !== "all" ? STATUS_LABELS[status] : "all",
        }
      );
      toast.success("PDF generado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo generar el PDF");
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loader text="Cargando inventario..." />
      </Layout>
    );
  }

  const shown = filtered.slice(0, visible);

  const renderActions = (material) =>
    isAdmin && (
      <div className="material-actions" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          icon={Edit}
          onClick={() => setFormTarget(material)}
          aria-label={`Editar ${material.name}`}
          title="Editar"
        />
        <Button
          variant="danger-ghost"
          size="sm"
          icon={Trash2}
          onClick={() => setToDelete(material)}
          aria-label={`Eliminar ${material.name}`}
          title="Eliminar"
        />
      </div>
    );

  return (
    <Layout>
      <div className="page materials">
        <PageHeader
          title="Inventario"
          subtitle={
            hasFilters
              ? `${filtered.length} de ${materials.length} materiales`
              : `${materials.length} materiales registrados`
          }
          actions={
            <>
              {canCreate && (
                <Button variant="secondary" icon={Upload} onClick={() => setShowImport(true)}>
                  Importar
                </Button>
              )}
              <Button
                variant="secondary"
                icon={QrCode}
                onClick={() =>
                  filtered.length
                    ? setShowLabels(true)
                    : toast.error("No hay materiales para etiquetar")
                }
              >
                Etiquetas
              </Button>
              <Button variant="secondary" icon={FileSpreadsheet} onClick={handleExportExcel}>
                Excel
              </Button>
              <Button variant="secondary" icon={FileDown} onClick={handleExportPDF}>
                PDF
              </Button>
              {canCreate && (
                <Button icon={Plus} onClick={() => setFormTarget("new")}>
                  Nuevo material
                </Button>
              )}
            </>
          }
        />

        <div className="toolbar">
          <Input
            className="grow"
            name="search"
            placeholder="Buscar por nombre, código, categoría, ubicación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
            aria-label="Buscar materiales"
            suffix={
              search ? (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={X}
                  onClick={() => setSearch("")}
                  aria-label="Limpiar búsqueda"
                />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ScanLine}
                  onClick={() => setShowScanner(true)}
                  aria-label="Buscar por código de barras"
                  title="Escanear código"
                />
              )
            }
          />
          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filtrar por categoría"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="all">Todos los estados</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            aria-label="Filtrar por stock"
          >
            {Object.entries(STOCK_FILTERS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Ordenar"
          >
            {Object.entries(SORTS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <div className="btn-group" role="group" aria-label="Vista">
            <Button
              variant="ghost"
              icon={LayoutGrid}
              className={viewMode === "grid" ? "is-active" : ""}
              onClick={() => setViewMode("grid")}
              aria-label="Vista en tarjetas"
              aria-pressed={viewMode === "grid"}
            />
            <Button
              variant="ghost"
              icon={List}
              className={viewMode === "list" ? "is-active" : ""}
              onClick={() => setViewMode("list")}
              aria-label="Vista en lista"
              aria-pressed={viewMode === "list"}
            />
          </div>
        </div>

        {materials.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Todavía no hay materiales"
            description="Crea el primer material para empezar a controlar el stock."
            action={
              canCreate && (
                <Button icon={Plus} onClick={() => setFormTarget("new")}>
                  Nuevo material
                </Button>
              )
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Sin resultados"
            description="Ningún material coincide con los filtros aplicados."
            action={
              <Button variant="secondary" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            }
          />
        ) : viewMode === "grid" ? (
          <div className="materials-grid">
            {shown.map((m) => {
              const s = getStock(m);
              const level = getStockLevel(m);
              return (
                <article
                  key={m.id}
                  className="material-card"
                  tabIndex={0}
                  role="button"
                  onClick={() => openDetail(m.id)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && e.target === e.currentTarget && openDetail(m.id)
                  }
                >
                  <MaterialMedia material={m} />
                  <div className="material-body">
                    <div className="material-title-row">
                      <div className="material-title">
                        <h3>{m.name}</h3>
                        <span className="mono">{m.code}</span>
                      </div>
                      {renderActions(m)}
                    </div>
                    <div className="material-badges">
                      <Badge size="sm" variant={m.status} dot>
                        {STATUS_LABELS[m.status] || m.status}
                      </Badge>
                    </div>
                    <p className="material-meta">
                      {getLabel(m.category)}
                      {m.subcategory && ` · ${m.subcategory}`}
                    </p>
                    <p className="material-meta">
                      <MapPin size={12} /> {m.location || "—"}
                    </p>
                    <div className="material-stock">
                      <div className={`material-stock-main level-${level}`}>
                        <span className="material-stock-value">{s.available}</span>
                        <span className="material-stock-label">{STOCK_LEVEL_LABELS[level]}</span>
                      </div>
                      <div className="material-stock-side">
                        <span>
                          En uso <strong>{s.committed}</strong>
                        </span>
                        <span>
                          Mant. <strong>{s.maintenance}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table materials-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Categoría</th>
                  <th>Ubicación</th>
                  <th>Estado</th>
                  <th className="num">Disp.</th>
                  <th className="num">En uso</th>
                  <th className="num">Mant.</th>
                  {isAdmin && <th aria-label="Acciones" />}
                </tr>
              </thead>
              <tbody>
                {shown.map((m) => {
                  const s = getStock(m);
                  const level = getStockLevel(m);
                  return (
                    <tr key={m.id} className="clickable" onClick={() => openDetail(m.id)}>
                      <td>
                        <div className="material-cell">
                          <MaterialThumb material={m} />
                          <span>
                            <span className="cell-title">{m.name}</span>
                            <span className="cell-sub mono">{m.code}</span>
                          </span>
                        </div>
                      </td>
                      <td>{getLabel(m.category)}</td>
                      <td className="text-secondary">{m.location || "—"}</td>
                      <td>
                        <Badge size="sm" variant={m.status}>
                          {STATUS_LABELS[m.status] || m.status}
                        </Badge>
                      </td>
                      <td className="num">
                        <Badge size="sm" variant={LEVEL_VARIANT[level]}>
                          {s.available}
                        </Badge>
                      </td>
                      <td className="num">{s.committed}</td>
                      <td className="num">{s.maintenance}</td>
                      {isAdmin && <td className="num">{renderActions(m)}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > visible && (
          <div className="load-more">
            <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Mostrar más ({filtered.length - visible} restantes)
            </Button>
          </div>
        )}

        {isGuest && (
          <p className="materials-readonly">
            Estás en modo sólo lectura. Pide a un administrador permisos para editar.
          </p>
        )}
      </div>

      {formTarget && (
        <MaterialForm
          material={formTarget === "new" ? null : formTarget}
          materials={materials}
          categories={categories}
          onClose={() => setFormTarget(null)}
        />
      )}

      {detailMaterial && !formTarget && (
        <MaterialDetail
          material={detailMaterial}
          categoryLabel={getLabel(detailMaterial.category)}
          onClose={closeDetail}
          onEdit={() => setFormTarget(detailMaterial)}
        />
      )}

      {showLabels && (
        <LabelsDialog
          materials={filtered}
          getCategoryLabel={getLabel}
          onClose={() => setShowLabels(false)}
        />
      )}

      {showImport && (
        <ImportDialog
          materials={materials}
          categories={categories}
          onClose={() => setShowImport(false)}
        />
      )}

      {showScanner && (
        <BarcodeScanner
          title="Buscar por código"
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        title="Eliminar material"
        message={
          <>
            Se eliminará <strong>{toDelete?.name}</strong> ({toDelete?.code}) del inventario. Los
            movimientos registrados se conservan en el historial. Esta acción no se puede deshacer.
          </>
        }
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </Layout>
  );
};

export default Materiales;
