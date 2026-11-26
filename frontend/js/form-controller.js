// Shared behaviour for add-source.html and add-consumer.html.
import { api } from "./api.js";
import { FACILITY_TYPES, RESOURCE_TYPES, UNITS, KIND_CONFIG, HEAT_RESOURCE, HEAT_UNITS } from "./constants.js";
import { validateRecord, buildPayload, FIELDS } from "./validation.js";
import { h, alertBox, toast } from "./ui.js";

function fillSelect(select, options) {
  select.append(...options.map((o) => h("option", { value: o }, o)));
}

export function initResourceForm(kind) {
  const cfg = KIND_CONFIG[kind];
  const form = document.getElementById("resource-form");
  const field = (name) => form.elements[name];
  const alertHost = document.getElementById("form-alert");
  const success = document.getElementById("form-success");
  const successText = document.getElementById("success-text");
  const tempField = document.getElementById("temperature-field");
  const unitHint = document.getElementById("unit-hint");
  const submitBtn = document.getElementById("submit-btn");

  fillSelect(field("facility_type"), FACILITY_TYPES);
  fillSelect(field("resource"), RESOURCE_TYPES);
  fillSelect(field("unit"), UNITS);

  const values = () => Object.fromEntries(FIELDS.map((f) => [f, field(f).value]));

  function setError(name, message) {
    document.getElementById(`${name}-error`).textContent = message || "";
    if (message) field(name).setAttribute("aria-invalid", "true");
    else field(name).removeAttribute("aria-invalid");
  }

  function syncDependentFields() {
    const heat = field("resource").value === HEAT_RESOURCE;
    tempField.hidden = !heat;
    field("temperature").disabled = !heat;
    if (!heat) { field("temperature").value = ""; setError("temperature", ""); }
    // Soft hint only: the backend accepts any unit with any resource.
    const resource = field("resource").value;
    const unit = field("unit").value;
    let hint = "";
    if (resource === HEAT_RESOURCE && unit && !HEAT_UNITS.includes(unit)) hint = "Heat is usually measured in kW or MW. You can keep this unit if it is correct.";
    else if (resource && resource !== HEAT_RESOURCE && HEAT_UNITS.includes(unit)) hint = "kW and MW are normally used for heat. Check that the unit suits this resource.";
    unitHint.textContent = hint;
  }

  field("resource").addEventListener("change", syncDependentFields);
  field("unit").addEventListener("change", syncDependentFields);

  form.addEventListener("change", (e) => {
    const name = e.target.name;
    if (!FIELDS.includes(name)) return;
    setError(name, validateRecord(kind, values()).errors[name]);
  });
  form.addEventListener("input", (e) => {
    if (FIELDS.includes(e.target.name) && e.target.hasAttribute("aria-invalid")) setError(e.target.name, "");
  });
  form.addEventListener("reset", () => setTimeout(() => {
    FIELDS.forEach((f) => setError(f, ""));
    alertHost.replaceChildren();
    syncDependentFields();
  }, 0));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    alertHost.replaceChildren();
    success.hidden = true;

    const { errors } = validateRecord(kind, values());
    FIELDS.forEach((f) => setError(f, errors[f]));
    const firstInvalid = FIELDS.find((f) => errors[f]);
    if (firstInvalid) {
      alertHost.replaceChildren(alertBox("error", "Some fields need attention. Fix the highlighted fields and save again."));
      field(firstInvalid).focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Saving…";
    try {
      const payload = buildPayload(kind, values());
      await (kind === "source" ? api.addSource(payload) : api.addConsumer(payload));
      const message = api.isMock
        ? `Resource ${cfg.label} saved as demo data. It exists only in this browser, not in the SQLite database.`
        : `Resource ${cfg.label} saved.`;
      successText.textContent = message;
      success.hidden = false;
      toast(`Resource ${cfg.label} saved.`);
      form.reset();
      success.focus();
    } catch (err) {
      alertHost.replaceChildren(alertBox("error", err.message || "The record could not be saved. Try again."));
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = `Save resource ${cfg.label}`;
    }
  });

  document.getElementById("add-another")?.addEventListener("click", () => { success.hidden = true; field("facility_name").focus(); });
  syncDependentFields();
}
