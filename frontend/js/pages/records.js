import "../nav.js";
import { api } from "../api.js";
import { FACILITY_TYPES, RESOURCE_TYPES, KIND_CONFIG } from "../constants.js";
import { h, icon, alertBox, emptyState, skeletonLines, formatQuantity, formatTemperature, formatDate, resourceBadge, toast, confirmDialog } from "../ui.js";

const state = {
  kind: location.hash === "#consumers" ? "consumer" : "source",
  data: { source: [], consumer: [] },
  status: "loading",
  q: "", resource: "", facility: "",
};
const $ = (id) => document.getElementById(id);
const host = $("table-host");
const panel = $("records-panel");
const tabs = [...document.querySelectorAll(".tab")];

/* ---------- filters ---------- */
$("filter-resource").append(...RESOURCE_TYPES.map((t) => h("option", { value: t }, t)));
$("filter-facility").append(...FACILITY_TYPES.map((t) => h("option", { value: t }, t)));

function filtered() {
  const cfg = KIND_CONFIG[state.kind];
  const q = state.q.trim().toLowerCase();
  return state.data[state.kind].filter((r) => {
    if (state.resource && r[cfg.resourceKey] !== state.resource) return false;
    if (state.facility && r.facility_type !== state.facility) return false;
    if (!q) return true;
    return [r.id, r.facility_name, r.facility_type, r[cfg.resourceKey], r.location, r.description]
      .some((v) => String(v ?? "").toLowerCase().includes(q));
  });
}

function clearFilters() {
  state.q = state.resource = state.facility = "";
  $("search").value = $("filter-resource").value = $("filter-facility").value = "";
  render();
}

$("search").addEventListener("input", (e) => { state.q = e.target.value; render(); });
$("filter-resource").addEventListener("change", (e) => { state.resource = e.target.value; render(); });
$("filter-facility").addEventListener("change", (e) => { state.facility = e.target.value; render(); });
$("clear-filters").addEventListener("click", clearFilters);

/* ---------- tabs ---------- */
function selectTab(kind, focus = false) {
  state.kind = kind;
  tabs.forEach((t) => {
    const on = t.dataset.kind === kind;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    if (on) { panel.setAttribute("aria-labelledby", t.id); if (focus) t.focus(); }
  });
  history.replaceState(null, "", `#${KIND_CONFIG[kind].plural}`);
  render();
}
tabs.forEach((t, i) => {
  t.addEventListener("click", () => selectTab(t.dataset.kind));
  t.addEventListener("keydown", (e) => {
    const next = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (next) { e.preventDefault(); selectTab(tabs[(i + next + tabs.length) % tabs.length].dataset.kind, true); }
  });
});

/* ---------- rendering ---------- */
function cell(label, ...content) { return h("td", { "data-label": label }, ...content); }

function buildTable(rows) {
  const cfg = KIND_CONFIG[state.kind];
  const heads = ["ID", "Facility", cfg.resourceColumn, cfg.quantityColumn, cfg.temperatureColumn, "Location", "Added", "Actions"];
  return h("div", { class: "table-wrap" },
    h("table", { class: "data-table" },
      h("caption", { class: "sr-only" }, `Registered resource ${cfg.plural}`),
      h("thead", {}, h("tr", {}, heads.map((t) => h("th", { scope: "col" }, t)))),
      h("tbody", {}, rows.map((r) => h("tr", {},
        cell("ID", h("span", { class: "num muted" }, `#${r.id}`)),
        cell("Facility", h("div", {},
          h("span", { class: "cell-name" }, r.facility_name, " ", r.is_demo ? h("span", { class: "badge badge-demo" }, "Demo") : null),
          h("span", { class: "cell-sub" }, r.facility_type),
          r.description ? h("span", { class: "cell-desc", title: r.description }, r.description) : null)),
        cell(cfg.resourceColumn, resourceBadge(r[cfg.resourceKey])),
        cell(cfg.quantityColumn, h("span", { class: "num" }, `${formatQuantity(r[cfg.quantityKey])} ${r.unit}`)),
        cell(cfg.temperatureColumn, h("span", { class: "num" }, formatTemperature(r[cfg.temperatureKey]))),
        cell("Location", r.location),
        cell("Added", h("span", { class: "num" }, formatDate(r.created_at))),
        cell("Actions", h("button", {
          class: "btn btn-quiet-danger", type: "button",
          "aria-label": `Delete ${cfg.label} #${r.id}, ${r.facility_name}`,
          onclick: () => onDelete(state.kind, r),
        }, icon("trash", 16), "Delete")))))));
}

function render() {
  const cfg = KIND_CONFIG[state.kind];
  for (const kind of ["source", "consumer"]) {
    $(`count-${kind}`).textContent = state.status === "ready" ? String(state.data[kind].length) : "–";
  }
  const countEl = $("results-count");
  countEl.textContent = "";

  if (state.status === "loading") { host.replaceChildren(skeletonLines(6)); host.setAttribute("aria-busy", "true"); return; }
  host.removeAttribute("aria-busy");

  if (state.status === "error") {
    host.replaceChildren(alertBox("error", state.error, [h("button", { class: "btn btn-outline btn-sm", type: "button", onclick: load }, icon("refresh", 16), "Try again")]));
    return;
  }
  const all = state.data[state.kind];
  if (!all.length) {
    host.replaceChildren(emptyState({ iconName: "database", title: `No ${cfg.plural} registered`, text: `Records you add will appear here.`, action: { href: `add-${state.kind}.html`, label: `Add a ${cfg.label}` } }));
    return;
  }
  const rows = filtered();
  countEl.textContent = `Showing ${rows.length} of ${all.length} ${cfg.plural}`;
  if (!rows.length) {
    host.replaceChildren(emptyState({ iconName: "search", title: "No matching records", text: "Change the search words or filters to see more.", action: { label: "Clear filters", onclick: clearFilters } }));
    return;
  }
  host.replaceChildren(buildTable(rows));
}

async function onDelete(kind, record) {
  const cfg = KIND_CONFIG[kind];
  const ok = await confirmDialog({
    title: `Delete this ${cfg.label}?`,
    message: `“${record.facility_name}” (record #${record.id}) will be removed. ${api.isMock ? "This only changes demo data in your browser." : "Deleting a record is permanent for this database."}`,
    confirmLabel: `Delete ${cfg.label}`,
    danger: true,
  });
  if (!ok) return;
  try {
    await (kind === "source" ? api.deleteSource(record.id) : api.deleteConsumer(record.id));
    state.data[kind] = state.data[kind].filter((r) => r.id !== record.id);
    toast(`${cfg.label[0].toUpperCase()}${cfg.label.slice(1)} deleted.`);
    render();
  } catch (err) {
    toast(err.message || "The record could not be deleted.", "error");
  }
}

async function load() {
  state.status = "loading";
  render();
  try {
    const [source, consumer] = await Promise.all([api.getSources(), api.getConsumers()]);
    state.data = { source, consumer };
    state.status = "ready";
  } catch (err) {
    state.status = "error";
    state.error = err.message;
  }
  render();
}

window.addEventListener("hashchange", () => selectTab(location.hash === "#consumers" ? "consumer" : "source"));
selectTab(state.kind);
load();
