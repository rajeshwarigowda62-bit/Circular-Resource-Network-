# CRN Frontend (Phase 1)

Plain HTML, CSS and JavaScript (ES modules). No build step, no frameworks.

## Run with VS Code Live Server (Windows)
1. Open the `frontend` folder in VS Code (File > Open Folder).
2. Install the **Live Server** extension (Ritwick Dey) from the Extensions panel.
3. Right-click `index.html` and choose **Open with Live Server**.
4. The site opens at `http://127.0.0.1:5500`. ES modules need a server, so opening the files by double-click will not work.

## Demo mode (default)
`js/config.js` has `USE_MOCK: true`. All data comes from `js/mock-data.js` and is stored in this browser's localStorage.
Nothing touches the real SQLite database. A banner on every page says so. Use "Reset demo data" in the banner to start over.

## Switching to the real API
1. Ask the backend team for a thin API that imports `database.py` unchanged (see the contract at the top of `js/api.js`).
2. In `js/config.js` set `USE_MOCK: false` and `API_BASE_URL` to the API address.
3. The API must allow CORS from the Live Server origin and return JSON objects with the same field names as the SQLite columns.

## Structure
- `css/` tokens, base, shared components, and one stylesheet per page type
- `js/api.js` the only file that talks to a backend; `js/config.js` the switch
- `js/constants.js` the exact option lists from `app.py`; `js/validation.js` mirrors its rules
- `js/pages/` one script per page
