import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  limit as limitTo,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import { COLLECTIONS, DEFAULT_CATEGORIES } from "../constants";

// Con "estimate" los serverTimestamp pendientes devuelven la hora local
// en vez de null, así los registros recién creados se ordenan bien.
const mapDocs = (snapshot) =>
  snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data({ serverTimestamps: "estimate" }),
  }));

/**
 * Suscripción en tiempo real a una consulta de Firestore.
 */
const useLiveQuery = (buildQuery, deps, errorLabel) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      buildQuery(),
      (snapshot) => {
        setData(mapDocs(snapshot));
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error(`Error al cargar ${errorLabel}:`, err);
        setError(err);
        setLoading(false);
      }
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
};

/** Todos los materiales, ordenados por nombre en el cliente. */
export const useMaterials = () => {
  const { data, loading, error } = useLiveQuery(
    () => collection(db, COLLECTIONS.MATERIALS),
    [],
    "materiales"
  );
  const materials = useMemo(
    () =>
      [...data].sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""), "es")
      ),
    [data]
  );
  return { materials, loading, error };
};

/** Movimientos más recientes primero. `max` limita la cantidad. */
export const useMovements = (max) => {
  const { data, loading, error } = useLiveQuery(
    () =>
      max
        ? query(collection(db, COLLECTIONS.MOVEMENTS), orderBy("createdAt", "desc"), limitTo(max))
        : query(collection(db, COLLECTIONS.MOVEMENTS), orderBy("createdAt", "desc")),
    [max],
    "movimientos"
  );
  return { movements: data, loading, error };
};

/** Todos los usuarios. */
export const useUsers = () => {
  const { data, loading, error } = useLiveQuery(
    () => collection(db, COLLECTIONS.USERS),
    [],
    "usuarios"
  );
  const users = useMemo(
    () =>
      [...data].sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""), "es")
      ),
    [data]
  );
  return { users, loading, error };
};

/**
 * Categorías configurables (documento system/categories).
 * Si el documento no existe se usan las categorías por defecto.
 */
export const useCategories = () => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "system", "categories"),
      (snap) => {
        if (snap.exists()) {
          setCategories(snap.data().categories || []);
          setExists(true);
        } else {
          setCategories(DEFAULT_CATEGORIES);
          setExists(false);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error al cargar categorías:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const getLabel = (key) => categories.find((c) => c.key === key)?.label || key || "—";

  return { categories, exists, loading, getLabel };
};
