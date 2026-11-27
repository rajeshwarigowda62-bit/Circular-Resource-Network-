// Mirrors the rules in app.py. The server remains the authority; this gives instant feedback.
import { FACILITY_TYPES, RESOURCE_TYPES, UNITS, KIND_CONFIG, HEAT_RESOURCE, MIN_QUANTITY } from "./constants.js";

export const FIELDS = ["facility_name", "facility_type", "resource", "quantity", "unit", "temperature", "location", "description"];

export function validateRecord(kind, v) {
  const cfg = KIND_CONFIG[kind];
  const errors = {};

  if (!(v.facility_name || "").trim()) errors.facility_name = "Enter the facility name.";
  else if (v.facility_name.trim().length > 120) errors.facility_name = "Use 120 characters or fewer.";

  if (!FACILITY_TYPES.includes(v.facility_type)) errors.facility_type = "Choose a facility type.";
  if (!RESOURCE_TYPES.includes(v.resource)) errors.resource = `Choose the ${cfg.resourceNoun}.`;

  const q = String(v.quantity ?? "").trim();
  if (q === "") errors.quantity = "Enter a quantity.";
  else if (!Number.isFinite(Number(q))) errors.quantity = "Enter a valid number.";
  else if (Number(q) < MIN_QUANTITY) errors.quantity = `Quantity must be at least ${MIN_QUANTITY}.`;

  if (!UNITS.includes(v.unit)) errors.unit = "Choose a unit.";

  if (v.resource === HEAT_RESOURCE) {
    const t = String(v.temperature ?? "").trim();
    if (t === "") errors.temperature = "Enter a temperature in °C for heat resources.";
    else if (!Number.isFinite(Number(t))) errors.temperature = "Enter a valid number.";
  }

  if (!(v.location || "").trim()) errors.location = "Enter the city or area.";
  if ((v.description || "").length > 1000) errors.description = "Use 1000 characters or fewer.";

  return { errors, valid: Object.keys(errors).length === 0 };
}

// Builds the JSON body using the exact database column names. Temperature is null unless Waste Heat.
export function buildPayload(kind, v) {
  const cfg = KIND_CONFIG[kind];
  const heat = v.resource === HEAT_RESOURCE;
  return {
    facility_name: v.facility_name.trim(),
    facility_type: v.facility_type,
    [cfg.resourceKey]: v.resource,
    [cfg.quantityKey]: Number(v.quantity),
    unit: v.unit,
    [cfg.temperatureKey]: heat ? Number(v.temperature) : null,
    location: v.location.trim(),
    description: (v.description || "").trim(),
  };
}
