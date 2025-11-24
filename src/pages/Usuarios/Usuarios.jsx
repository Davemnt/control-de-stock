import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield, User as UserIcon } from 'lucide-react';
import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { COLLECTIONS, ROLES } from '../../constants';
import { formatDateTime } from '../../utils/formatters';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Badge from '../../components/Badge/Badge';
import Modal from '../../components/Modal/Modal';
import toast from 'react-hot-toast';
import './Usuarios.css';

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.USER,
    active: true
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error('Completa todos los campos requeridos');
      return;
    }

    if (!editingUser && !formData.password) {
      toast.error('La contraseña es requerida para nuevos usuarios');
      return;
    }

    try {
      if (editingUser) {
        // Update existing user
        await updateDoc(doc(db, COLLECTIONS.USERS, editingUser.id), {
          name: formData.name,
          role: formData.role,
          active: formData.active,
          updatedAt: serverTimestamp()
        });
        toast.success('Usuario actualizado');
      } else {
        // Create new user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        await addDoc(collection(db, COLLECTIONS.USERS), {
          uid: userCredential.user.uid,
          name: formData.name,
          email: formData.email.toLowerCase(),
          role: formData.role,
          active: formData.active,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        toast.success('Usuario creado');
      }

      setShowModal(false);
      resetForm();
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      let message = 'Error al guardar usuario';
      
      if (error.code === 'auth/email-already-in-use') {
        message = 'El email ya está en uso';
      } else if (error.code === 'auth/weak-password') {
        message = 'La contraseña es muy débil (mínimo 6 caracteres)';
      }
      
      toast.error(message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || ROLES.USER,
      active: user.active !== false
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
      toast.success('Usuario eliminado');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar usuario');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
        active: !currentStatus,
        updatedAt: serverTimestamp()
      });
      toast.success(currentStatus ? 'Usuario desactivado' : 'Usuario activado');
      loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Error al cambiar estado');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: ROLES.USER,
      active: true
    });
    setEditingUser(null);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return <Badge variant="primary">Administrador</Badge>;
      case ROLES.USER:
        return <Badge variant="info">Usuario</Badge>;
      case ROLES.GUEST:
        return <Badge variant="default">Invitado</Badge>;
      default:
        return <Badge variant="default">{role}</Badge>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="usuarios-loading">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="usuarios">
        <div className="usuarios-header">
          <div>
            <h1>Gestión de Usuarios</h1>
            <p>{users.length} usuarios registrados</p>
          </div>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowModal(true)}
          >
            Nuevo Usuario
          </Button>
        </div>

        <div className="usuarios-grid">
          {users.map(user => (
            <Card key={user.id} className="user-card" hover>
              <div className="user-header">
                <div className="user-avatar">
                  {user.role === ROLES.ADMIN ? (
                    <Shield size={24} />
                  ) : (
                    <UserIcon size={24} />
                  )}
                </div>
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p className="user-email">{user.email}</p>
                </div>
              </div>

              <div className="user-details">
                <div className="user-detail-item">
                  <span className="label">Rol:</span>
                  {getRoleBadge(user.role)}
                </div>
                <div className="user-detail-item">
                  <span className="label">Estado:</span>
                  <Badge variant={user.active !== false ? 'success' : 'error'}>
                    {user.active !== false ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <div className="user-detail-item">
                  <span className="label">Creado:</span>
                  <span className="value">
                    {formatDateTime(user.createdAt?.toDate?.() || new Date())}
                  </span>
                </div>
              </div>

              <div className="user-actions">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit}
                  onClick={() => handleEdit(user)}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleUserStatus(user.id, user.active !== false)}
                >
                  {user.active !== false ? 'Desactivar' : 'Activar'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleDelete(user.id)}
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* User Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="user-form">
            <Input
              label="Nombre completo"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!!editingUser}
              required
            />

            {!editingUser && (
              <Input
                label="Contraseña"
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                helper="Mínimo 6 caracteres"
                required
              />
            )}

            <div className="input-group">
              <label className="input-label">Rol *</label>
              <select
                className="input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value={ROLES.ADMIN}>Administrador</option>
                <option value={ROLES.USER}>Usuario</option>
                <option value={ROLES.GUEST}>Invitado</option>
              </select>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <span>Usuario activo</span>
              </label>
            </div>

            <div className="modal-footer">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                {editingUser ? 'Actualizar' : 'Crear'} Usuario
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Usuarios;
