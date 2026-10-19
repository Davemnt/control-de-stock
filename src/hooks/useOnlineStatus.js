import { useEffect, useState } from "react";

/** true si el navegador tiene conexión de red */
export const useOnlineStatus = () => {
  const [online, setOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine
  );

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  return online;
};

/** Mensaje estándar cuando una operación necesita conexión */
export const OFFLINE_MESSAGE =
  "Sin conexión: esta operación necesita internet para no descuadrar el stock. Inténtalo al recuperar la señal.";
