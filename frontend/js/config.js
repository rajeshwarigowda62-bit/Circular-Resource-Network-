/**
 * Frontend configuration.
 *
 * USE_MOCK = true  -> every page uses demo data kept in this browser (localStorage).
 *                     Nothing is sent to the backend or saved in the SQLite database.
 * USE_MOCK = false -> every page calls the real API at API_BASE_URL (see js/api.js).
 */
export const CONFIG = {
  USE_MOCK: true,
  API_BASE_URL: "http://localhost:8000/api",
  MOCK_LATENCY_MS: 450,
  STORAGE_KEY: "crn_demo_data_v1",
};
