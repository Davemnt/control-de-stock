# 🎨 Marcas por cliente

Cada carpeta de `brands/` es la identidad visual de un cliente. Se activa con `VITE_BRAND=<carpeta>` en su archivo `.env`; sin esa variable, la app usa el diseño estándar.

```
brands/
└── aurea/
    ├── brand.json      # qué archivos usar y colores de la app instalable
    ├── theme.css       # colores, fuente y menú lateral
    ├── logo.png        # cabecera del login y menú lateral (cuadrado)
    ├── login-bg.png    # fondo del panel izquierdo del login
    ├── icon-192.png    # favicon y app instalable
    └── icon-512.png
```

Los archivos se publican en `/brand/…` solo en el build de esa marca: un cliente nunca recibe los logos de otro.

## Crear la marca de un cliente nuevo

1. Copia `brands/aurea/` como `brands/<cliente>/`.
2. Reemplaza las imágenes:
   - **`logo.png`:** cuadrado, de 256 px o más.
   - **`login-bg.png`:** horizontal, por ejemplo 1920×1080. Puede ser una foto o un patrón.
   - **`icon-192.png` / `icon-512.png`:** el logo a esos tamaños.
3. En **`theme.css`**, cambia los colores:
   - **Marca:** `--c-brand` (botones y elementos activos) y `--c-brand-hover`.
   - **Neutros:** `--c-body` (fondo), `--c-surface` (tarjetas), `--c-text`.
   - **Menú lateral:** `--sidebar-bg`.
   - **Tema oscuro:** el bloque `[data-theme="dark"]`.
4. En **`theme.css`**, define la fuente de títulos (`--font-bold`, `--heading-stretch`). La fuente se carga desde la URL `fonts` de `brand.json` (Google Fonts).
5. En **`brand.json`**, ajusta `name`, `themeColor` y `backgroundColor`.
6. Pon `VITE_BRAND=<cliente>` en `.env.<cliente>` y pruébalo con `npx vite --mode <cliente>`.

Mantén el contraste: el texto blanco sobre `--c-brand` debe leerse bien (los botones usan ese par).

## Aurea

Los colores están medidos del logo y del patrón oficiales:

- **Naranja:** `#de591f`
- **Carbón:** `#262727`
- **Crema:** `#f0edd6`

Fuente de títulos: **Archivo** expandida, la alternativa libre más cercana a la grotesca ancha del logo.
