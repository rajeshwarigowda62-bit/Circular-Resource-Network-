// Shared UI helpers. User-entered text is always inserted as text nodes (never innerHTML).
import { RESOURCE_META } from "./constants.js";

export const ICONS = {
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  flask: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
  box: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 8.7 5 8.7-5"/>',
  sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
  layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  circle: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  menu: '<path d="M4 12h16M4 6h16M4 18h16"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  check: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  building: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  chart: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
  menuClose: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
};

export function iconSvg(name, size = 20) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.circle}</svg>`;
}

/** Build an element. props: class, on* handlers, dataset, any attribute. Children are text or nodes. */
export function h(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value == null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key.startsWith("on") && typeof value === "function") node.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key === "dataset") Object.assign(node.dataset, value);
    else node.setAttribute(key, value === true ? "" : value);
  }
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function icon(name, size = 20) {
  const span = h("span", { class: "icon", "aria-hidden": "true" });
  span.innerHTML = iconSvg(name, size); // static markup from ICONS only
  return span;
}

/** Fill any <span data-icon="name" data-size="22"> placeholders in static HTML. */
export function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]:not([data-hydrated])").forEach((el) => {
    el.classList.add("icon");
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = iconSvg(el.dataset.icon, Number(el.dataset.size) || 20);
    el.dataset.hydrated = "1";
  });
}

/* ---------- Formatting ---------- */
export const formatQuantity = (n) => Number(n).toLocaleString("en-IN", { maximumFractionDigits: 3 });
export const formatTemperature = (t) => (t == null ? "—" : `${Number(t).toLocaleString("en-IN", { maximumFractionDigits: 2 })} °C`);
export function formatDate(value) {
  if (!value) return "—";
  const s = String(value);
  const date = new Date(s.includes("T") ? s : `${s.replace(" ", "T")}Z`); // SQLite timestamps are UTC
  return Number.isNaN(date.getTime()) ? s : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function resourceBadge(type) {
  const meta = RESOURCE_META[type] || RESOURCE_META.Other;
  return h("span", { class: `badge tone-${meta.tone}` }, icon(meta.icon, 14), type);
}

/* ---------- States ---------- */
export function alertBox(type, message, actions = []) {
  const name = type === "error" ? "alert" : type === "success" ? "check" : "info";
  return h("div", { class: `alert alert-${type}`, role: type === "error" ? "alert" : "status" },
    icon(name, 20),
    h("div", { class: "alert-body" }, h("p", {}, message), actions.length ? h("div", { class: "alert-actions" }, actions) : null));
}

export function emptyState({ iconName = "database", title, text, action }) {
  let button = null;
  if (action) {
    button = action.href
      ? h("a", { class: "btn btn-primary", href: action.href }, action.label)
      : h("button", { class: "btn btn-outline", type: "button", onclick: action.onclick }, action.label);
  }
  return h("div", { class: "empty-state" }, h("span", { class: "empty-icon" }, icon(iconName, 26)), h("h3", {}, title), h("p", {}, text), button);
}

export function skeletonLines(count = 4) {
  return h("div", { class: "skeleton-rows", "aria-hidden": "true" }, Array.from({ length: count }, () => h("span", { class: "skeleton skel-line" })));
}

export function countUp(el, to, ms = 700) {
  if (to === 0 || matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = String(to); return; }
  const start = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - start) / ms);
    el.textContent = Math.round(to * (1 - (1 - p) ** 3)).toLocaleString("en-IN");
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- Toasts ---------- */
export function toast(message, type = "success", timeout = 5000) {
  let region = document.getElementById("toast-region");
  if (!region) {
    region = h("div", { id: "toast-region", class: "toast-region", "aria-live": "polite" });
    document.body.append(region);
  }
  const close = () => node.remove();
  const node = h("div", { class: `toast toast-${type}`, role: type === "error" ? "alert" : "status" },
    icon(type === "error" ? "alert" : "check", 20),
    h("p", {}, message),
    h("button", { class: "toast-close", type: "button", "aria-label": "Dismiss message", onclick: close }, icon("x", 16)));
  region.append(node);
  setTimeout(close, timeout);
}

/* ---------- Confirmation dialog (native <dialog>: focus trap + Esc built in) ---------- */
export function confirmDialog({ title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false }) {
  return new Promise((resolve) => {
    let confirmed = false;
    const dialog = h("dialog", { class: "modal", "aria-labelledby": "modal-title", "aria-describedby": "modal-text" },
      h("div", { class: "modal-body" },
        h("span", { class: `modal-icon${danger ? "" : " is-neutral"}` }, icon(danger ? "trash" : "info", 22)),
        h("h2", { id: "modal-title" }, title),
        h("p", { id: "modal-text" }, message)),
      h("div", { class: "modal-actions" },
        h("button", { class: "btn btn-outline", type: "button", autofocus: true, onclick: () => dialog.close() }, cancelLabel),
        h("button", { class: `btn ${danger ? "btn-danger" : "btn-primary"}`, type: "button", onclick: () => { confirmed = true; dialog.close(); } }, confirmLabel)));
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => { dialog.remove(); resolve(confirmed); });
    document.body.append(dialog);
    dialog.showModal();
  });
}
