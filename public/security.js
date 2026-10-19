// ============================================
// SISTEMA DE SEGURIDAD AVANZADO
// Control de Stock - Protección contra inspección y extracción
// ============================================

(function () {
  "use strict";

  // En desarrollo local no se aplica ninguna protección (permite usar DevTools)
  if (["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname)) {
    return;
  }

  // ============================================
  // CONFIGURACIÓN
  // ============================================

  const CONFIG = {
    enableProtection: true,
    enableDevToolsDetection: true,
    enableContextMenu: false,
    enableKeyboardShortcuts: false,
    enableTextSelection: false,
    enableConsoleClear: true,
    enableDebuggerDetection: true,
    clearConsoleInterval: 1000,
    redirectOnDevTools: false,
    redirectUrl: "about:blank",
  };

  // Código de desbloqueo secreto: Ctrl+Alt+Shift+D
  let devModeEnabled = false;

  // ============================================
  // DETECTAR DEVTOOLS
  // ============================================

  const detectDevTools = (() => {
    const threshold = 160;
    let isOpen = false;

    const check = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold =
        window.outerHeight - window.innerHeight > threshold;
      const orientation = widthThreshold ? "vertical" : "horizontal";

      if (
        !(heightThreshold && widthThreshold) &&
        ((window.Firebug &&
          window.Firebug.chrome &&
          window.Firebug.chrome.isInitialized) ||
          widthThreshold ||
          heightThreshold)
      ) {
        if (!isOpen && CONFIG.enableProtection && !devModeEnabled) {
          isOpen = true;
          handleDevToolsOpen();
        }
      } else {
        isOpen = false;
      }
    };

    return { check, isOpen: () => isOpen };
  })();

  // ============================================
  // DETECCIÓN AVANZADA CON DEBUGGER
  // ============================================

  const debuggerDetection = () => {
    if (!CONFIG.enableDebuggerDetection || devModeEnabled) return;

    const devtools = /./;
    devtools.toString = function () {
      handleDevToolsOpen();
      return "DevTools detectado";
    };

    console.log("%c", devtools);

    // Método alternativo
    const before = new Date().getTime();
    debugger;
    const after = new Date().getTime();

    if (after - before > 100 && CONFIG.enableProtection && !devModeEnabled) {
      handleDevToolsOpen();
    }
  };

  // ============================================
  // MANEJO DE DEVTOOLS ABIERTO
  // ============================================

  const handleDevToolsOpen = () => {
    if (CONFIG.redirectOnDevTools) {
      window.location.href = CONFIG.redirectUrl;
    } else {
      document.body.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #1a1a1a;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 20px;
        ">
          <div style="
            text-align: center;
            max-width: 500px;
            padding: 40px;
            background: #2a2a2a;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          ">
            <div style="font-size: 64px; margin-bottom: 20px;">🔒</div>
            <h1 style="color: #DE591F; margin: 0 0 20px 0; font-size: 28px;">
              Acceso Denegado
            </h1>
            <p style="color: #aaa; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Esta aplicación está protegida contra inspección. 
              Las herramientas de desarrollo están deshabilitadas por motivos de seguridad.
            </p>
            <button onclick="window.location.reload()" style="
              background: #DE591F;
              color: white;
              border: none;
              padding: 12px 32px;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
              font-weight: 600;
              transition: all 0.3s;
            " onmouseover="this.style.background='#ff6a2f'" onmouseout="this.style.background='#DE591F'">
              Recargar Página
            </button>
          </div>
        </div>
      `;
    }
  };

  // ============================================
  // DESHABILITAR CLIC DERECHO
  // ============================================

  const disableContextMenu = (e) => {
    if (
      !CONFIG.enableContextMenu &&
      CONFIG.enableProtection &&
      !devModeEnabled
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  // ============================================
  // DESHABILITAR ATAJOS DE TECLADO
  // ============================================

  const disableKeyboardShortcuts = (e) => {
    if (devModeEnabled) return;

    // Código secreto para habilitar modo dev: Ctrl+Alt+Shift+D
    if (e.ctrlKey && e.altKey && e.shiftKey && e.keyCode === 68) {
      devModeEnabled = !devModeEnabled;
      console.clear();
      console.log(
        `%c🔓 Modo Desarrollador ${
          devModeEnabled ? "ACTIVADO" : "DESACTIVADO"
        }`,
        `color: ${
          devModeEnabled ? "#4ade80" : "#ef4444"
        }; font-size: 18px; font-weight: bold;`
      );
      if (!devModeEnabled) {
        window.location.reload();
      }
      return;
    }

    if (!CONFIG.enableKeyboardShortcuts && CONFIG.enableProtection) {
      // F12 - DevTools
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+I - Inspector
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+J - Consola
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+C - Selector de elementos
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }

      // Ctrl+U - Ver código fuente
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }

      // Ctrl+S - Guardar página
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
      }

      // Ctrl+P - Imprimir (puede revelar código)
      if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
        return false;
      }
    }
  };

  // ============================================
  // DESHABILITAR SELECCIÓN DE TEXTO
  // ============================================

  const disableTextSelection = (e) => {
    if (
      !CONFIG.enableTextSelection &&
      CONFIG.enableProtection &&
      !devModeEnabled
    ) {
      // Permitir selección en inputs y textareas
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return true;
      }
      e.preventDefault();
      return false;
    }
  };

  // ============================================
  // DESHABILITAR ARRASTRAR
  // ============================================

  const disableDrag = (e) => {
    if (CONFIG.enableProtection && !devModeEnabled) {
      // Permitir arrastrar en inputs de archivo
      if (e.target.type === "file") {
        return true;
      }
      e.preventDefault();
      return false;
    }
  };

  // ============================================
  // LIMPIAR CONSOLA PERIÓDICAMENTE
  // ============================================

  let consoleInterval;
  const clearConsole = () => {
    if (
      CONFIG.enableConsoleClear &&
      CONFIG.enableProtection &&
      !devModeEnabled
    ) {
      console.clear();

      // Sobrescribir métodos de consola
      const methods = [
        "log",
        "debug",
        "info",
        "warn",
        "error",
        "dir",
        "dirxml",
        "table",
        "trace",
        "group",
        "groupCollapsed",
        "groupEnd",
        "clear",
        "count",
        "assert",
        "markTimeline",
        "profile",
        "profileEnd",
        "timeline",
        "timelineEnd",
        "time",
        "timeEnd",
        "timeStamp",
        "context",
        "memory",
      ];

      methods.forEach((method) => {
        console[method] = () => {};
      });
    }
  };

  // ============================================
  // PROTECCIÓN CONTRA COPY/PASTE
  // ============================================

  const disableCopy = (e) => {
    if (CONFIG.enableProtection && !devModeEnabled) {
      // Permitir copiar en inputs y textareas
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return true;
      }
      e.preventDefault();
      return false;
    }
  };

  // ============================================
  // DETECTAR HERRAMIENTAS DE GRABBING
  // ============================================

  const detectGrabbers = () => {
    // Detectar extensiones comunes de grabbing
    const suspiciousPatterns = [
      "webScraper",
      "scraper",
      "grabber",
      "downloader",
      "ripper",
      "extractor",
    ];

    // Verificar propiedades del window
    for (let prop in window) {
      const propLower = prop.toLowerCase();
      if (suspiciousPatterns.some((pattern) => propLower.includes(pattern))) {
        console.warn("Herramienta de extracción detectada");
        if (CONFIG.enableProtection && !devModeEnabled) {
          handleDevToolsOpen();
        }
      }
    }
  };

  // ============================================
  // PROTECCIÓN DE IMÁGENES
  // ============================================

  const protectImages = () => {
    document.addEventListener("contextmenu", (e) => {
      if (
        e.target.tagName === "IMG" &&
        CONFIG.enableProtection &&
        !devModeEnabled
      ) {
        e.preventDefault();
        return false;
      }
    });

    // Prevenir arrastrar imágenes
    document.addEventListener("dragstart", (e) => {
      if (
        e.target.tagName === "IMG" &&
        CONFIG.enableProtection &&
        !devModeEnabled
      ) {
        e.preventDefault();
        return false;
      }
    });
  };

  // ============================================
  // OFUSCAR CÓDIGO EN PRODUCCIÓN
  // ============================================

  const obfuscateConsole = () => {
    if (CONFIG.enableProtection && !devModeEnabled) {
      // Redirigir errores
      window.onerror = () => true;

      // Detectar si se está usando algún proxy/interceptor
      if (
        window.fetch.toString().length < 100 ||
        XMLHttpRequest.prototype.open.toString().length < 100
      ) {
        console.warn("Interceptor detectado");
      }
    }
  };

  // ============================================
  // PROTECCIÓN CONTRA IFRAME EMBEDDING
  // ============================================

  const preventFraming = () => {
    if (window.self !== window.top) {
      window.top.location = window.self.location;
    }
  };

  // ============================================
  // INICIALIZAR TODAS LAS PROTECCIONES
  // ============================================

  const init = () => {
    // Event listeners
    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("keydown", disableKeyboardShortcuts);
    document.addEventListener("selectstart", disableTextSelection);
    document.addEventListener("dragstart", disableDrag);
    document.addEventListener("copy", disableCopy);
    document.addEventListener("cut", disableCopy);

    // Protecciones adicionales
    protectImages();
    preventFraming();
    obfuscateConsole();
    detectGrabbers();

    // Detección de DevTools
    if (CONFIG.enableDevToolsDetection) {
      setInterval(() => {
        detectDevTools.check();
        debuggerDetection();
      }, 1000);
    }

    // Limpiar consola periódicamente
    if (CONFIG.enableConsoleClear) {
      consoleInterval = setInterval(clearConsole, CONFIG.clearConsoleInterval);
      clearConsole();
    }

    // Mensaje inicial (solo si modo dev está desactivado)
    if (!devModeEnabled) {
      setTimeout(() => {
        console.clear();
        console.log(
          "%c⚠️ ADVERTENCIA DE SEGURIDAD",
          "color: #ef4444; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
        );
        console.log(
          "%cEsta aplicación está protegida. El acceso no autorizado está prohibido.",
          "color: #f59e0b; font-size: 14px;"
        );
        console.log(
          "%c© 2025 Control de Stock - Todos los derechos reservados",
          "color: #6b7280; font-size: 12px;"
        );
      }, 500);
    }
  };

  // ============================================
  // EJECUTAR AL CARGAR
  // ============================================

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Protección adicional contra modificaciones
  Object.freeze(CONFIG);
})();
