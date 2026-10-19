import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

// Clave nueva: la versión anterior guardaba "dark" automáticamente en todos
// los navegadores; con esta clave todos arrancan en tema claro.
export const THEME_STORAGE_KEY = "cs-theme";

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  }
  return context;
};

const getInitialTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#141517" : "#f3f4f6");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      localStorage.removeItem("theme");
    } catch {
      // almacenamiento no disponible: el tema sólo dura esta sesión
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
