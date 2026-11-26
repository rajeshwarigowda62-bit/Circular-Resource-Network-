/**
 * The ONLY file that talks to a backend (real or mock).
 * Pages import `api` and never call fetch() or localStorage themselves.
 *
 * Expected real endpoints (to agree with the backend team), JSON with snake_case fields
 * named exactly like the SQLite columns:
 *   GET    /counts              -> { sources, consumers, total }
 *   GET    /sources             -> [ { id, facility_name, ... } ]
 *   POST   /sources             -> created record
 *   DELETE /sources/{id}
 *   GET    /consumers   POST /consumers   DELETE /consumers/{id}
 * Errors: a non-2xx status with { "error": "message" } (FastAPI's { "detail": ... } also works).
 */
import { CONFIG } from "./config.js";
import { DEMO_SOURCES, DEMO_CONSUMERS } from "./mock-data.js";

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const ENDPOINT = { source: "/sources", consumer: "/consumers" };
const byNewest = (a, b) => Number(b.id) - Number(a.id); // same order as ORDER BY id DESC
const toList = (body) => (Array.isArray(body) ? body : body?.items ?? body?.data ?? []);

function messageFrom(body, status) {
  const detail = body?.error ?? body?.detail ?? body?.message;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const text = detail.map((d) => d.msg || d.message).filter(Boolean).join(" ");
    if (text) return text;
  }
  return status === 404 ? "That record no longer exists." : `The server returned an error (${status}).`;
}

/* ---------------- Real API ---------------- */
async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${CONFIG.API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError("Cannot reach the CRN API. Check that the backend is running, that API_BASE_URL in js/config.js is correct, and that CORS allows this origin.");
  }
  if (res.status === 204) return null;
  let body = null;
  try { body = await res.json(); } catch { /* empty or non-JSON body */ }
  if (!res.ok) throw new ApiError(messageFrom(body, res.status), res.status);
  return body;
}

const real = {
  async list(kind) { return toList(await request(ENDPOINT[kind])).sort(byNewest); },
  async add(kind, payload) { return request(ENDPOINT[kind], { method: "POST", body: JSON.stringify(payload) }); },
  async remove(kind, id) { await request(`${ENDPOINT[kind]}/${encodeURIComponent(id)}`, { method: "DELETE" }); },
  async counts() {
    const b = await request("/counts");
    return { sources: b.sources, consumers: b.consumers, total: b.total ?? b.sources + b.consumers };
  },
};

/* ---------------- Mock API (demo data in this browser only) ---------------- */
const wait = () => new Promise((r) => setTimeout(r, CONFIG.MOCK_LATENCY_MS));
const clone = (o) => JSON.parse(JSON.stringify(o));
const bucket = (kind) => (kind === "source" ? "sources" : "consumers");
let cache = null;

function seed() { return { sources: clone(DEMO_SOURCES), consumers: clone(DEMO_CONSUMERS) }; }
function persist() { try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(cache)); } catch { /* storage unavailable: keep in memory */ } }
function read() {
  if (!cache) {
    try { cache = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)); } catch { cache = null; }
    if (!cache || !Array.isArray(cache.sources) || !Array.isArray(cache.consumers)) { cache = seed(); persist(); }
  }
  return cache;
}

const mock = {
  async list(kind) { await wait(); return clone(read()[bucket(kind)]).sort(byNewest); },
  async add(kind, payload) {
    await wait();
    const rows = read()[bucket(kind)];
    const quantity = Number(payload[kind === "source" ? "quantity" : "required_quantity"]);
    if (!String(payload.facility_name || "").trim() || !String(payload.location || "").trim()) throw new ApiError("Facility name and location are required.", 422);
    if (!(quantity > 0)) throw new ApiError("Quantity must be greater than 0.", 422);
    const id = rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    const record = { id, ...payload, created_at: new Date().toISOString().slice(0, 19).replace("T", " "), is_demo: true };
    rows.push(record);
    persist();
    return clone(record);
  },
  async remove(kind, id) {
    await wait();
    const db = read();
    const key = bucket(kind);
    const before = db[key].length;
    db[key] = db[key].filter((r) => r.id !== Number(id));
    if (db[key].length === before) throw new ApiError("That record no longer exists.", 404);
    persist();
  },
  async counts() {
    await wait();
    const { sources, consumers } = read();
    return { sources: sources.length, consumers: consumers.length, total: sources.length + consumers.length };
  },
  async reset() { cache = seed(); persist(); },
};

/* ---------------- Public API used by every page ---------------- */
const backend = CONFIG.USE_MOCK ? mock : real;

export const api = {
  isMock: CONFIG.USE_MOCK,
  getCounts: () => backend.counts(),
  getSources: () => backend.list("source"),
  getConsumers: () => backend.list("consumer"),
  addSource: (payload) => backend.add("source", payload),
  addConsumer: (payload) => backend.add("consumer", payload),
  deleteSource: (id) => backend.remove("source", id),
  deleteConsumer: (id) => backend.remove("consumer", id),
  resetDemoData: () => mock.reset(),
};
