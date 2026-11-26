// Renders the shared header, footer and demo-mode banner on every page.
import { CONFIG } from "./config.js";
import { api } from "./api.js";
import { h, icon, hydrateIcons, confirmDialog } from "./ui.js";

const LINKS = [
  ["index", "index.html", "Home"],
  ["dashboard", "dashboard.html", "Dashboard"],
  ["add-source", "add-source.html", "Add source"],
  ["add-consumer", "add-consumer.html", "Add consumer"],
  ["records", "records.html", "Records"],
];
const current = document.body.dataset.page;

function buildHeader() {
  const slot = document.getElementById("site-header");
  if (!slot) return;

  const nav = h("nav", { id: "primary-nav", class: "nav-links", "aria-label": "Primary" },
    LINKS.map(([id, href, label]) => h("a", { class: "nav-link", href, "aria-current": id === current ? "page" : null }, label)));
  const toggle = h("button", { class: "nav-toggle", type: "button", "aria-expanded": "false", "aria-controls": "primary-nav", "aria-label": "Open menu" }, icon("menu", 22));
  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.replaceChildren(icon(open ? "x" : "menu", 22));
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); } });
  matchMedia("(min-width: 881px)").addEventListener("change", () => setOpen(false));

  const brand = h("a", { class: "brand", href: "index.html", "aria-label": "CRN, Circular Resource Network: home" },
    h("span", { class: "brand-mark" }, icon("leaf", 20)),
    h("span", { class: "brand-text" }, h("strong", {}, "CRN"), h("span", {}, "Circular Resource Network")));

  const header = h("header", { class: "site-header" },
    h("div", { class: "container nav-inner" }, brand, nav,
      h("div", { class: "nav-actions" }, h("a", { class: "btn btn-primary btn-sm", href: "dashboard.html" }, "Get started"), toggle)));

  const parts = [];
  if (CONFIG.USE_MOCK) {
    parts.push(h("div", { class: "demo-banner", role: "note" },
      icon("info", 16),
      h("span", {}, h("strong", {}, "Demo mode: "), "sample records live only in this browser. Nothing is saved to the CRN SQLite database."),
      h("button", { class: "demo-reset", type: "button", onclick: resetDemo }, "Reset demo data")));
  }
  parts.push(header);
  slot.replaceChildren(...parts);
}

async function resetDemo() {
  const ok = await confirmDialog({
    title: "Reset demo data?",
    message: "This restores the original sample records and removes any demo records you added in this browser. The real database is not affected.",
    confirmLabel: "Reset demo data",
  });
  if (!ok) return;
  await api.resetDemoData();
  location.reload();
}

function buildFooter() {
  const slot = document.getElementById("site-footer");
  if (!slot) return;
  const link = (href, text) => h("li", {}, h("a", { href }, text));
  slot.replaceChildren(h("footer", { class: "site-footer" }, h("div", { class: "container" },
    h("div", { class: "footer-grid" },
      h("div", {}, h("h2", {}, "CRN, Circular Resource Network"),
        h("p", {}, "A registry that helps facilities share heat, water, brine and reusable materials instead of discarding them.")),
      h("div", {}, h("h2", {}, "Platform"), h("ul", {}, link("dashboard.html", "Dashboard"), link("add-source.html", "Add a source"), link("add-consumer.html", "Add a consumer"), link("records.html", "Records"))),
      h("div", {}, h("h2", {}, "Project"), h("ul", {}, link("index.html#how-it-works", "How it works"), link("index.html#roadmap", "Roadmap")))),
    h("p", { class: "footer-base" }, "CRN prototype, Phase 1: resource registration. Matching and optimization are planned for Phase 2."))));
}

buildHeader();
buildFooter();
hydrateIcons();
