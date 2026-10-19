import {
  Speaker,
  Lightbulb,
  MonitorPlay,
  Link2,
  Construction,
  Cable,
  Backpack,
  Wrench,
  Package,
} from "lucide-react";
import { normalize } from "./stock";

// Icono y tono por categoría (se detecta por palabra clave en el nombre)
const RULES = [
  { match: "audio", icon: Speaker, hue: 24 },
  { match: "ilumin", icon: Lightbulb, hue: 42 },
  { match: "video", icon: MonitorPlay, hue: 220 },
  { match: "rigging", icon: Link2, hue: 262 },
  { match: "estructura", icon: Construction, hue: 190 },
  { match: "cable", icon: Cable, hue: 150 },
  { match: "mochila", icon: Backpack, hue: 330 },
  { match: "repuesto", icon: Wrench, hue: 0 },
];

/** Tono estable a partir del texto, para categorías personalizadas */
const hashHue = (text) =>
  [...String(text)].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 360, 7);

/**
 * Devuelve { icon, style } para una categoría.
 * `style` define las variables CSS --cat-h (tono) usadas por .cat-tint.
 */
export const getCategoryVisual = (categoryKey) => {
  const key = normalize(categoryKey);
  const rule = RULES.find((r) => key.includes(r.match));
  const hue = rule ? rule.hue : hashHue(key);
  return { icon: rule ? rule.icon : Package, style: { "--cat-h": hue } };
};
