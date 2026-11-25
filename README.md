# CRN — Circular Resource Network (Phase 1)

A Streamlit + SQLite prototype for recording resource sources and resource consumers. This is the Phase 1 foundation; resource matching and optimization are planned for later phases.

## Features

- Dashboard with source and consumer counts
- Register available resource sources
- Register resource consumers and their requirements
- View saved records
- Delete records with a confirmation step
- SQLite database created automatically

## Requirements

- Python 3.10+
- pip

## Run locally

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
python -m venv .venv
```

Activate the environment:

**Windows PowerShell**
```powershell
.venv\Scripts\Activate.ps1
```

**macOS / Linux**
```bash
source .venv/bin/activate
```

Install and run:

```bash
pip install -r requirements.txt
streamlit run app.py
```

Open the local URL shown in the terminal, usually http://localhost:8501.

## Deploy so your team can view it

1. Push these files to a GitHub repository.
2. Sign in to [Streamlit Community Cloud](https://share.streamlit.io/) using GitHub.
3. Select **Create app**, choose your repository and branch.
4. Set the main file path to `app.py`.
5. Deploy and share the generated app URL with your team.

The GitHub repository stores the code. Streamlit Community Cloud runs the application.

## Important database note

This starter uses a local SQLite file (`crn.db`). It is suitable for local development and a prototype demonstration. On hosted services, local files may not be durable across app restarts, redeployments, or infrastructure changes. For reliable shared team data, connect the app to a hosted database (for example, PostgreSQL/Supabase) before relying on it for ongoing records. Do not commit real personal, confidential, or sensitive data to GitHub.

## Phase 1 scope

Included: resource registration, storage, viewing, and deletion.

Not included yet: automatic resource matching, distance calculations, heat-cascade analysis, AI, optimization, or financial feasibility calculations.
