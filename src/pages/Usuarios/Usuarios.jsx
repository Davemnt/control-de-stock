import React, { useMemo, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  KeyRound,
  UserX,
  UserCheck,
  Users as UsersIcon,
  SearchX,
} from "lucide-react";
import { deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";
import { auth, db, withSecondaryAuth } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useUsers } from "../../hooks/useFirestore";
import { COLLECTIONS, ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES, VALIDATION } from "../../constants";
import { formatDate } from "../../utils/formatters";
import { isValidEmail } from "../../utils/validation";
import { normalize, toDate } from "../../utils/stock";
import Layout from "../../components/Layout/Layout";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Badge from "../../components/Badge/Badge";
import Modal from "../../components/Modal/Modal";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import PageHeader from "../../components/PageHeader/PageHeader";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loader from "../../components/Loader/Loader";
import "./Usuarios.css";

const ROLE_VARIANT = {
  [ROLES.ADMIN]: "primary",
  [ROLES.EMPLOYEE]: "warning",
  [ROLES.USER]: "info",
  [ROLES.GUEST]: "default",
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("") || "?";

const EMPTY_FORM = { name: "", email: "", password: "", role: ROLES.USER, active: true };

const UserForm = ({ user, isSelf, onClose }) => {
  const isEdit = Boolean(user);
  const [form, setForm] = useState(
    isEdit
      ? { name: user.name || "", email: user.email || "", password: "", role: user.role || ROLES.USER, active: user.active !== false }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "El nombre es obligatorio";
    if (!isEdit) {
      if (!isValidEmail(form.email.trim())) next.email = "Email inválido";
      if (form.password.length < VALIDATION.PASSWORD_MIN_LENGTH)
        next.password = `Mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEdit) {
        await updateDoc(doc(db, COLLECTIONS.USERS, user.id), {
          name: form.name.trim(),
          role: form.role,
          active: form.active,
          updatedAt: serverTimestamp(),
        });
        toast.success("Usuario actualizado");
      } else {
        const email = form.email.trim().toLowerCase();
        // Se crea con una instancia secundaria para no cerrar la sesión del admin
        const uid = await withSecondaryAuth(async (secondaryAuth) => {
          const cred = await createUserWithEmailAndPassword(secondaryAuth, email, form.password);
          return cred.user.uid;
        });
        await setDoc(doc(db, COLLECTIONS.USERS, uid), {
          uid,
          name: form.name.trim(),
          email,
          role: form.role,
          active: form.active,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast.success(`Usuario ${form.name.trim()} creado`);
      }
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
      const messages = {
        "auth/email-already-in-use": "Ese email ya tiene una cuenta",
        "auth/weak-password": "La contraseña es demasiado débil",
        "auth/invalid-email": "Email inválido",
        "permission-denied": "No tienes permisos para gestionar usuarios",
      };
      if (error.code === "auth/email-already-in-use") setErrors({ email: messages[error.code] });
      toast.error(messages[error.code] || "No se pudo guardar el usuario");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={saving ? () => {} : onClose}
      title={isEdit ? "Editar usuario" : "Nuevo usuario"}
      subtitle={isEdit ? user.email : "Tendrá acceso con su email y contraseña"}
      size="md"
      closeOnBackdrop={false}
    >
      <form onSubmit={handleSubmit} className="form-stack" noValidate>
        <Input
          label="Nombre completo"
          name="name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          error={errors.name}
          autoComplete="off"
          required
        />
        {!isEdit && (
          <div className="form-grid">
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              error={errors.email}
              autoComplete="off"
              required
            />
            <Input
              label="Contraseña inicial"
              type="text"
              name="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              error={errors.password}
              helper={`Mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`}
              autoComplete="new-password"
              required
            />
          </div>
        )}

        <fieldset className="role-picker">
          <legend className="input-label">Rol</legend>
          {Object.values(ROLES).map((role) => (
            <label key={role} className={`role-option ${form.role === role ? "is-selected" : ""}`}>
              <input
                type="radio"
                name="role"
                value={role}
                checked={form.role === role}
                onChange={() => set("role", role)}
                disabled={isSelf}
              />
              <span>
                <strong>{ROLE_LABELS[role]}</strong>
                <small>{ROLE_DESCRIPTIONS[role]}</small>
              </span>
            </label>
          ))}
        </fieldset>

        {isSelf ? (
          <p className="input-helper">No puedes cambiar tu propio rol ni desactivarte.</p>
        ) : (
          <label className="checkbox-label">
            <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
            Usuario activo (puede iniciar sesión)
          </label>
        )}

        <div className="form-actions">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {isEdit ? "Guardar cambios" : "Crear usuario"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const Usuarios = () => {
  const { currentUser } = useAuth();
  const { users, loading } = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [formTarget, setFormTarget] = useState(null); // null | "new" | user
  const [toDelete, setToDelete] = useState(null);

  const counts = useMemo(() => {
    const c = { all: users.length };
    Object.values(ROLES).forEach((r) => {
      c[r] = users.filter((u) => u.role === r).length;
    });
    return c;
  }, [users]);

  const filtered = useMemo(() => {
    const term = normalize(search.trim());
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      return !term || normalize(`${u.name} ${u.email}`).includes(term);
    });
  }, [users, search, roleFilter]);

  const toggleActive = async (user) => {
    const active = user.active !== false;
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, user.id), {
        active: !active,
        updatedAt: serverTimestamp(),
      });
      toast.success(active ? `${user.name} desactivado` : `${user.name} activado`);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo cambiar el estado");
    }
  };

  const sendReset = async (user) => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success(`Email de restablecimiento enviado a ${user.email}`);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo enviar el email");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.USERS, toDelete.id));
      toast.success("Usuario eliminado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar el usuario");
      throw error;
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loader text="Cargando usuarios..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page usuarios">
        <PageHeader
          title="Usuarios"
          subtitle={`${users.length} usuarios · ${users.filter((u) => u.active !== false).length} activos`}
          actions={
            <Button icon={Plus} onClick={() => setFormTarget("new")}>
              Nuevo usuario
            </Button>
          }
        />

        <div className="toolbar">
          <Input
            className="grow"
            name="search"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
            aria-label="Buscar usuarios"
          />
          <div className="chips" role="group" aria-label="Filtrar por rol">
            {["all", ...Object.values(ROLES)].map((r) => (
              <button
                key={r}
                type="button"
                className={`chip ${roleFilter === r ? "is-active" : ""}`}
                onClick={() => setRoleFilter(r)}
                aria-pressed={roleFilter === r}
              >
                {r === "all" ? "Todos" : ROLE_LABELS[r]} <span className="chip-count">{counts[r]}</span>
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={users.length ? SearchX : UsersIcon}
            title={users.length ? "Sin resultados" : "No hay usuarios"}
            description={users.length ? "Prueba con otra búsqueda." : undefined}
          />
        ) : (
          <div className="users-grid">
            {filtered.map((u) => {
              const isSelf = u.id === currentUser?.uid;
              const active = u.active !== false;
              return (
                <article key={u.id} className={`user-card ${active ? "" : "is-inactive"}`}>
                  <div className="user-card-top">
                    <div className="user-avatar">{getInitials(u.name)}</div>
                    <div className="user-info">
                      <h3>
                        {u.name || "Sin nombre"}
                        {isSelf && <span className="user-self">Tú</span>}
                      </h3>
                      <p>{u.email}</p>
                    </div>
                  </div>
                  <div className="user-badges">
                    <Badge size="sm" variant={ROLE_VARIANT[u.role] || "default"}>
                      {ROLE_LABELS[u.role] || u.role || "Sin rol"}
                    </Badge>
                    <Badge size="sm" variant={active ? "success" : "error"} dot>
                      {active ? "Activo" : "Inactivo"}
                    </Badge>
                    <span className="user-date">Alta {formatDate(toDate(u.createdAt))}</span>
                  </div>
                  <div className="user-actions">
                    <Button variant="ghost" size="sm" icon={Edit} onClick={() => setFormTarget(u)}>
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={KeyRound}
                      onClick={() => sendReset(u)}
                      disabled={!u.email}
                      title="Enviar email para restablecer contraseña"
                      aria-label="Restablecer contraseña"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={active ? UserX : UserCheck}
                      onClick={() => toggleActive(u)}
                      disabled={isSelf}
                      title={isSelf ? "No puedes desactivarte a ti mismo" : active ? "Desactivar" : "Activar"}
                      aria-label={active ? "Desactivar" : "Activar"}
                    />
                    <Button
                      variant="danger-ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => setToDelete(u)}
                      disabled={isSelf}
                      title={isSelf ? "No puedes eliminar tu propio usuario" : "Eliminar"}
                      aria-label="Eliminar"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {formTarget && (
        <UserForm
          user={formTarget === "new" ? null : formTarget}
          isSelf={formTarget !== "new" && formTarget.id === currentUser?.uid}
          onClose={() => setFormTarget(null)}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        title="Eliminar usuario"
        message={
          <>
            Se eliminará el perfil de <strong>{toDelete?.name}</strong> y ya no podrá acceder al
            sistema. Si sólo quieres bloquear el acceso temporalmente, usa «Desactivar».
          </>
        }
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </Layout>
  );
};

export default Usuarios;
