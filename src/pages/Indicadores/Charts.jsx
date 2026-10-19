import React, { useEffect, useRef, useState } from "react";
import { formatNumber } from "../../utils";

/* Gráficos ligeros en SVG/HTML siguiendo la guía de visualización:
   barras finas (≤24px) con extremo redondeado de 4px, 2px de separación entre
   segmentos, grilla de 1px recesiva, textos siempre en tinta (no en el color
   de la serie) y tooltip al pasar el cursor o enfocar con teclado. */

const niceMax = (value) => {
  if (value <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => (s * pow * 4) >= value) * pow;
  return step * 4;
};

const useWidth = () => {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
};

/** Rectángulo con las esquinas superiores redondeadas (base cuadrada) */
const topRoundedRect = (x, y, w, h, r) => {
  const rr = Math.min(r, w / 2, h);
  return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`;
};

/**
 * Columnas apiladas por período.
 * series: [{ key, label, color }]  ·  data: [{ label, shortLabel, [key]: number }]
 */
export const StackedColumns = ({ data, series, height = 240, ariaLabel }) => {
  const [wrapRef, width] = useWidth();
  const [hover, setHover] = useState(null);

  const margin = { top: 12, right: 8, bottom: 28, left: 34 };
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = height - margin.top - margin.bottom;
  const totals = data.map((d) => series.reduce((acc, s) => acc + (d[s.key] || 0), 0));
  const max = niceMax(Math.max(0, ...totals));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));
  const band = data.length ? innerW / data.length : 0;
  const barW = Math.max(2, Math.min(24, band * 0.62));
  const y = (v) => innerH - (v / max) * innerH;
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(1, Math.floor(innerW / 64))));

  return (
    <div className="chart" ref={wrapRef}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={ariaLabel}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            {ticks.map((t) => (
              <g key={t} transform={`translate(0,${y(t)})`}>
                <line x2={innerW} className={t === 0 ? "chart-baseline" : "chart-grid"} />
                <text x={-8} dy="0.32em" textAnchor="end" className="chart-tick">
                  {formatNumber(t)}
                </text>
              </g>
            ))}

            {data.map((d, i) => {
              const x = i * band + (band - barW) / 2;
              let acc = 0;
              const visible = series.filter((s) => d[s.key] > 0);
              return (
                <g key={d.key || i} className={hover === i ? "is-hover" : ""}>
                  {visible.map((s, si) => {
                    const v = d[s.key];
                    const y0 = y(acc);
                    acc += v;
                    const y1 = y(acc);
                    const isTop = si === visible.length - 1;
                    // 2px de separación entre segmentos (salvo el inferior)
                    const gap = si > 0 ? 2 : 0;
                    const h = Math.max(0, y0 - y1 - gap);
                    return isTop ? (
                      <path key={s.key} d={topRoundedRect(x, y1, barW, h, 4)} fill={s.color} />
                    ) : (
                      <rect key={s.key} x={x} y={y1} width={barW} height={h} fill={s.color} />
                    );
                  })}
                  {i % labelEvery === 0 && (
                    <text x={x + barW / 2} y={innerH + 18} textAnchor="middle" className="chart-tick">
                      {d.shortLabel}
                    </text>
                  )}
                  {/* Zona de interacción: toda la banda, más grande que la barra */}
                  <rect
                    x={i * band}
                    y={0}
                    width={band}
                    height={innerH}
                    fill="transparent"
                    tabIndex={0}
                    aria-label={`${d.label}: ${series.map((s) => `${s.label} ${d[s.key] || 0}`).join(", ")}`}
                    onPointerEnter={() => setHover(i)}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    className="chart-hit"
                  />
                </g>
              );
            })}
          </g>
        </svg>
      )}

      {hover !== null && data[hover] && (
        <div
          className="chart-tooltip"
          style={{
            left: Math.min(
              Math.max(margin.left + hover * band + band / 2, 70),
              Math.max(70, width - 70)
            ),
          }}
        >
          <p className="chart-tooltip-title">{data[hover].label}</p>
          {series.map((s) => (
            <p key={s.key} className="chart-tooltip-row">
              <span className="chart-key-line" style={{ background: s.color }} />
              <strong>{data[hover][s.key] || 0}</strong>
              <span>{s.label}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Barras horizontales de una sola serie, con el valor en la punta.
 * rows: [{ label, value, hint }]
 */
export const BarList = ({ rows, color = "var(--viz-series-1)", formatValue = formatNumber }) => {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="barlist">
      {rows.map((r) => (
        <li key={r.label} className="barlist-row" title={r.hint ? `${r.label}: ${r.hint}` : undefined}>
          <span className="barlist-label">{r.label}</span>
          <span className="barlist-track">
            <span
              className="barlist-bar"
              style={{ width: `${Math.max(1.5, (r.value / max) * 100)}%`, background: color }}
            />
            <span className="barlist-value">{formatValue(r.value)}</span>
          </span>
        </li>
      ))}
    </ul>
  );
};

/** Leyenda con muestras rectangulares (refleja las columnas) */
export const Legend = ({ series }) => (
  <ul className="chart-legend">
    {series.map((s) => (
      <li key={s.key}>
        <span className="chart-legend-swatch" style={{ background: s.color }} />
        {s.label}
      </li>
    ))}
  </ul>
);
