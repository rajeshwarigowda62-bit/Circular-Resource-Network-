import "../nav.js";
import { api } from "../api.js";
import { RESOURCE_TYPES, KIND_CONFIG } from "../constants.js";
import { h, icon, alertBox, emptyState, formatQuantity, formatDate, resourceBadge, countUp } from "../ui.js";

const errorHost = document.getElementById("dash-error");

function renderStats(counts) {
  for (const key of ["sources", "consumers", "total"]) {
    const el = document.querySelector(`[data-stat="${key}"]`);
    el.replaceChildren();
    countUp(el, counts[key]);
  }
}

const tally = (rows, key) => rows.reduce((acc, r) => ((acc[r[key]] = (acc[r[key]] || 0) + 1), acc), {});

function bar(label, count, max, cls) {
  const pct = Math.round((count / max) * 100);
  return h("div", { class: "bar-line" },
    h("span", { class: "bar-track", role: "img", "aria-label": `${label}: ${count}` }, h("span", { class: `bar-fill ${cls}`, style: `width:${pct}%` })),
    h("span", { class: "bar-count" }, String(count)));
}

function renderCategories(sources, consumers) {
  const host = document.getElementById("category-overview");
  const s = tally(sources, KIND_CONFIG.source.resourceKey);
  const c = tally(consumers, KIND_CONFIG.consumer.resourceKey);
  const max = Math.max(1, ...RESOURCE_TYPES.map((t) => Math.max(s[t] || 0, c[t] || 0)));
  host.replaceChildren(
    h("div", { class: "cat-legend" }, h("span", {}, h("i"), "Sources"), h("span", {}, h("i"), "Consumers")),
    h("ul", { class: "cat-list" }, RESOURCE_TYPES.map((t) =>
      h("li", { class: "cat-row" }, resourceBadge(t), h("div", {}, bar("Sources", s[t] || 0, max, "bar-source"), bar("Consumers", c[t] || 0, max, "bar-consumer"))))),
  );
}

function recentItem(kind, r) {
  const cfg = KIND_CONFIG[kind];
  return h("li", { class: "recent-item" },
    h("strong", {}, r.facility_name),
    h("span", { class: "recent-meta" }, `${r.facility_type}, ${r.location}`),
    h("div", { class: "recent-side" }, resourceBadge(r[cfg.resourceKey]),
      h("span", {}, `${formatQuantity(r[cfg.quantityKey])} ${r.unit}`),
      h("span", { class: "recent-meta" }, formatDate(r.created_at))));
}

function renderRecent(kind, rows) {
  const cfg = KIND_CONFIG[kind];
  const host = document.getElementById(`recent-${cfg.plural}`);
  const title = `Recently added ${cfg.plural}`;
  host.replaceChildren(
    h("div", { class: "card-head" }, h("h2", {}, title), h("a", { class: "link-arrow", href: `records.html#${cfg.plural}` }, "View all")),
    rows.length
      ? h("ul", {}, rows.slice(0, 5).map((r) => recentItem(kind, r)))
      : emptyState({ iconName: kind === "source" ? "flame" : "building", title: `No ${cfg.plural} yet`, text: `Register the first ${cfg.label} to see it here.`, action: { href: `add-${kind}.html`, label: `Add a ${cfg.label}` } }),
  );
}

async function load() {
  errorHost.replaceChildren();
  try {
    const [counts, sources, consumers] = await Promise.all([api.getCounts(), api.getSources(), api.getConsumers()]);
    renderStats(counts);
    renderCategories(sources, consumers);
    renderRecent("source", sources);
    renderRecent("consumer", consumers);
  } catch (err) {
    document.querySelectorAll("[data-stat]").forEach((el) => (el.textContent = "–"));
    for (const id of ["category-overview", "recent-sources", "recent-consumers"]) document.getElementById(id).replaceChildren();
    errorHost.replaceChildren(alertBox("error", err.message, [
      h("button", { class: "btn btn-outline btn-sm", type: "button", onclick: load }, icon("refresh", 16), "Try again"),
    ]));
  }
}

load();
