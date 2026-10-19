import React, { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Moon, Sun, KeyRound, Save, Tags } from "lucide-react";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { ALERTS_DOC } from "../../utils/alerts";
import { isValidEmail } from "../../utils/validation";
import toast from "react-hot-toast";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useCategories, useMaterials } from "../../hooks/useFirestore";
import { COLLECTIONS, ROLE_LABELS } from "../../constants";
import { normalize } from "../../utils/stock";
import Layout from "../../components/Layout/Layout";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Modal from "../../components/Modal/Modal";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import PageHeader from "../../components/PageHeader/PageHeader";
import EmptyState from "../../components/EmptyState/EmptyState";
import "./Configuracion.css";

const CategoryForm = ({ category, categories, onSave, onClose }) => {
  const [label, setLabel] = useState(category?.label || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = label.trim();
    if (!value) return setError("El nombre es obligatorio");
    const duplicated = categories.some(
      (c) => c.key !== category?.key && normalize(c.label) === normalize(value)
    );
    if (duplicated) return setError("Ya existe una categoría con ese nombre");

    setSaving(true);
    try {
      await onSave(value);
      onClose();
    } catch {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={saving ? () => {} : onClose}
      title={category ? "Editar categoría" : "Nueva categoría"}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="form-stack" noValidate>
        <Input
          label="Nombre"
          name="label"
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            setError("");
          }}
          error={error}
          placeholder="Ej: Audio profesional"
          helper={category ? `Identificador interno: ${category.key}` : undefined}
          required
        />
        <div className="form-actions">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {category ? "Guardar" : "Crear"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

/** Avisos por email de stock bajo (documento system/alerts) */
const AlertsSettings = () => {
  const { currentUser } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [emails, setEmails] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getDoc(doc(db, ...ALERTS_DOC))
      .then((snap) => {
        if (snap.exists()) {
          setEnabled(Boolean(snap.data().enabled));
          setEmails((snap.data().emails || []).join("\n"));
        }
      })
      .catch((err) => console.error("Error al cargar avisos:", err))
      .finally(() => setLoaded(true));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const list = [...new Set(emails.split(/[\s,;]+/).map((x) => x.trim().toLowerCase()).filter(Boolean))];
    const invalid = list.filter((x) => !isValidEmail(x));
    if (invalid.length) return setError(`Emails no válidos: ${invalid.join(", ")}`);
    if (enabled && !list.length) return setError("Agrega al menos un email");
    setError("");
    setSaving(true);
    try {
      await setDoc(doc(db, ...ALERTS_DOC), {
        enabled,
        emails: list,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser?.uid || "",
      });
      setEmails(list.join("\n"));
      toast.success("Avisos guardados");
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron guardar los avisos");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Avisos de stock bajo por email" subtitle="Se envía un email cuando un material queda por debajo de su mínimo">
      <form className="form-stack" onSubmit={handleSave}>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            disabled={!loaded}
          />
          Enviar avisos automáticos
        </label>
        <Input
          type="textarea"
          label="Destinatarios"
          name="alertEmails"
          rows={3}
          value={emails}
          onChange={(e) => {
            setEmails(e.target.value);
            setError("");
          }}
          placeholder={"compras@empresa.com\ndeposito@empresa.com"}
          helper="Uno por línea o separados por comas."
          error={error}
          disabled={!loaded}
        />
        <p className="config-row-desc">
          Requiere la extensión gratuita «Trigger Email from Firestore» instalada en Firebase (plan
          Blaze), configurada con la colección <code>mail</code>. Sin ella, los avisos quedan en cola
          y no se envían.
        </p>
        <div>
          <Button type="submit" icon={Save} loading={saving} disabled={!loaded}>
            Guardar avisos
          </Button>
        </div>
      </form>
    </Card>
  );
};

const Configuracion = () => {
  const { userData, currentUser, isAdmin, resetPassword, refreshUserData } = useAuth();
  const { theme, setTheme } = useTheme();
  const { categories } = useCategories();
  const { materials } = useMaterials();

  const [name, setName] = useState(userData?.name || "");
  const [savingName, setSavingName] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [categoryTarget, setCategoryTarget] = useState(null); // null | "new" | category
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const usage = useMemo(() => {
    const map = {};
    materials.forEach((m) => {
      map[m.category] = (map[m.category] || 0) + 1;
    });
    return map;
  }, [materials]);

  const saveCategories = async (list) => {
    try {
      await setDoc(
        doc(db, "system", "categories"),
        { categories: list, updatedAt: serverTimestamp(), updatedBy: currentUser?.uid || "" },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving categories:", error);
      toast.error(
        error.code === "permission-denied"
          ? "No tienes permisos para modificar categorías"
          : "No se pudieron guardar las categorías"
      );
      throw error;
    }
  };

  const handleSaveCategory = async (label) => {
    if (categoryTarget === "new") {
      // El identificador se deriva del nombre y no cambia aunque se renombre
      let key = label;
      let n = 2;
      while (categories.some((c) => normalize(c.key) === normalize(key))) key = `${label} ${n++}`;
      await saveCategories([...categories, { key, label }]);
      toast.success("Categoría creada");
    } else {
      await saveCategories(
        categories.map((c) => (c.key === categoryTarget.key ? { ...c, label } : c))
      );
      toast.success("Categoría actualizada");
    }
  };

  const handleDeleteCategory = async () => {
    await saveCategories(categories.filter((c) => c.key !== categoryToDelete.key));
    toast.success("Categoría eliminada");
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    const value = name.trim();
    if (!value) return toast.error("El nombre no puede estar vacío");
    setSavingName(true);
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, currentUser.uid), {
        name: value,
        updatedAt: serverTimestamp(),
      });
      await refreshUserData();
      toast.success("Perfil actualizado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar el perfil");
    } finally {
      setSavingName(false);
    }
  };

  const handlePasswordReset = async () => {
    setSendingReset(true);
    try {
      await resetPassword(currentUser.email);
      toast.success(`Te enviamos un enlace a ${currentUser.email}`);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo enviar el email");
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <Layout>
      <div className="page config">
        <PageHeader title="Configuración" subtitle="Preferencias personales y del sistema" />

        <div className="config-grid">
          <Card title="Mi perfil" subtitle={`${ROLE_LABELS[userData?.role] || "Usuario"} · ${currentUser?.email}`}>
            <form onSubmit={handleSaveName} className="form-stack">
              <Input
                label="Nombre"
                name="profileName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                suffix={
                  name.trim() !== (userData?.name || "") && (
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      icon={Save}
                      loading={savingName}
                      aria-label="Guardar nombre"
                      title="Guardar"
                    />
                  )
                }
              />
              <div className="config-row">
                <div>
                  <p className="config-row-title">Contraseña</p>
                  <p className="config-row-desc">Recibirás un email para crear una nueva.</p>
                </div>
                <Button
                  variant="secondary"
                  icon={KeyRound}
                  onClick={handlePasswordReset}
                  loading={sendingReset}
                >
                  Cambiar
                </Button>
              </div>
            </form>
          </Card>

          <Card title="Apariencia" subtitle="Se guarda en este navegador">
            <div className="theme-options" role="radiogroup" aria-label="Tema">
              {[
                { value: "light", label: "Claro", icon: Sun },
                { value: "dark", label: "Oscuro", icon: Moon },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={theme === value}
                  className={`theme-option theme-${value} ${theme === value ? "is-selected" : ""}`}
                  onClick={() => setTheme(value)}
                >
                  <span className="theme-preview">
                    <span />
                    <span />
                    <span />
                  </span>
                  <span className="theme-option-label">
                    <Icon size={15} /> {label}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {isAdmin && (
          <Card
            title="Categorías de materiales"
            subtitle={`${categories.length} categorías`}
            actions={
              <Button size="sm" icon={Plus} onClick={() => setCategoryTarget("new")}>
                Nueva
              </Button>
            }
          >
            {categories.length === 0 ? (
              <EmptyState compact icon={Tags} title="No hay categorías" />
            ) : (
              <ul className="categories-list">
                {categories.map((cat) => {
                  const count = usage[cat.key] || 0;
                  return (
                    <li key={cat.key} className="category-item">
                      <div className="category-info">
                        <strong>{cat.label}</strong>
                        <span>
                          {count} {count === 1 ? "material" : "materiales"}
                        </span>
                      </div>
                      <div className="category-actions">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit}
                          onClick={() => setCategoryTarget(cat)}
                          aria-label={`Editar ${cat.label}`}
                          title="Editar"
                        />
                        <Button
                          variant="danger-ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => setCategoryToDelete(cat)}
                          disabled={count > 0}
                          aria-label={`Eliminar ${cat.label}`}
                          title={
                            count > 0
                              ? "No se puede eliminar: hay materiales en esta categoría"
                              : "Eliminar"
                          }
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        )}

        {isAdmin && <AlertsSettings />}
      </div>

      {categoryTarget && (
        <CategoryForm
          category={categoryTarget === "new" ? null : categoryTarget}
          categories={categories}
          onSave={handleSaveCategory}
          onClose={() => setCategoryTarget(null)}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(categoryToDelete)}
        title="Eliminar categoría"
        message={
          <>
            ¿Eliminar la categoría <strong>{categoryToDelete?.label}</strong>?
          </>
        }
        confirmLabel="Eliminar"
        onConfirm={handleDeleteCategory}
        onCancel={() => setCategoryToDelete(null)}
      />
    </Layout>
  );
};

export default Configuracion;
