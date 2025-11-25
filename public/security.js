// Protección contra inspección de elementos
// Este script dificulta (pero no imposibilita completamente) la inspección del código
// Presiona Ctrl+Alt+Shift+D para habilitar/deshabilitar la protección

(function () {
  "use strict";

  // Estado de la protección (por defecto activada)
  let protectionEnabled = true;

  // Función para mostrar estado actual
  const showProtectionStatus = () => {
    console.clear();
    console.log(
      `%c🔒 PROTECCIÓN ${protectionEnabled ? "ACTIVADA" : "DESACTIVADA"}`,
      `color: ${
        protectionEnabled ? "#DE591F" : "#4CAF50"
      }; font-size: 20px; font-weight: bold;`
    );
    console.log(
      `%cPresiona Ctrl+Alt+Shift+D para ${
        protectionEnabled ? "desactivar" : "activar"
      } la protección`,
      "color: #666; font-size: 12px;"
    );
  };

  // Tecla especial para toggle (Ctrl+Alt+Shift+D)
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.altKey && e.shiftKey && e.keyCode === 68) {
      protectionEnabled = !protectionEnabled;
      showProtectionStatus();
      return;
    }
  });

  // 1. Deshabilitar clic derecho
  document.addEventListener(
    "contextmenu",
    function (e) {
      if (protectionEnabled) {
        e.preventDefault();
        return false;
      }
    },
    false
  );

  // 2. Deshabilitar teclas de desarrollador
  document.addEventListener(
    "keydown",
    function (e) {
      if (!protectionEnabled) return;

      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+I (Inspector)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+J (Consola)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }

      // Ctrl+U (Ver código fuente)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }

      // Ctrl+S (Guardar página)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+C (Selector de elementos)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }
    },
    false
  );

  // 3. Detectar si DevTools está abierto
  let devtools = {
    open: false,
    orientation: null,
  };

  const threshold = 160;

  setInterval(() => {
    if (!protectionEnabled) return;

    if (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold
    ) {
      if (!devtools.open) {
        devtools.open = true;
        console.clear();
        console.log(
          "%c🚨 ACCESO DENEGADO",
          "color: red; font-size: 30px; font-weight: bold;"
        );
        console.log(
          "%c⚠️  La inspección de elementos está deshabilitada por seguridad",
          "color: orange; font-size: 16px;"
        );
        console.log(
          "%cPresiona Ctrl+Alt+Shift+D para desactivar la protección",
          "color: #666; font-size: 12px;"
        );
      }
    } else {
      devtools.open = false;
    }
  }, 500);

  // 4. Limpiar consola periódicamente
  setInterval(() => {
    if (protectionEnabled) {
      console.clear();
      showProtectionStatus();
    }
  }, 3000);

  // 5. Deshabilitar selección de texto (opcional)
  document.addEventListener(
    "selectstart",
    function (e) {
      if (!protectionEnabled) return true;

      // Permitir selección en inputs y textareas
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return true;
      }
      e.preventDefault();
      return false;
    },
    false
  );

  // 6. Deshabilitar arrastrar elementos
  document.addEventListener(
    "dragstart",
    function (e) {
      if (protectionEnabled) {
        e.preventDefault();
        return false;
      }
    },
    false
  );

  // 7. Mensaje inicial
  showProtectionStatus();
})();
