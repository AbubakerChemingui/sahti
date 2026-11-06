# Full Setup Guide

Everything needed to run Sahti's backend from scratch. Tested on Linux (Python 3.10 and 3.13); Windows commands are noted.

## Prerequisites

- Git (on Windows, use **Git Bash** for the `scripts/*.sh` files)
- Python **3.10 or newer** (CI uses 3.12)
- No database server needed for the demo: SQLite is a single file created on first use
- Later: Flutter SDK for the mobile app (`mobile/`), not needed yet
- A code editor with an AI assistant (VS Code + GitHub Copilot or Claude); `AI_CONTEXT.md` configures them

## Steps

```bash
# 1. Clone
git clone https://github.com/AbubakerChemingui/sahti.git
cd sahti

# 2. One-time project setup (enables the docs-reminder git hook)
./scripts/setup.sh

# 3. Environment variables — .env is gitignored; never commit it
cp .env.example .env
# edit .env: set your own SAHTI_JWT_SECRET and SAHTI_FIELD_ENCRYPTION_KEY

# 4. Install dependencies
python -m venv .venv
source .venv/bin/activate        # Windows (PowerShell): .venv\Scripts\Activate.ps1
pip install -r requirements.txt

# 5. Database: nothing to do yet (SQLite file sahti.db will be created by the app)

# 6. Run the API
uvicorn app.main:app --reload --app-dir backend --port 8001
# open http://127.0.0.1:8001/api/v1/health  →  {"status":"ok",...}
# API docs: http://127.0.0.1:8001/docs

# 7. Run tests
pytest
```

## Troubleshooting

- **Problem:** `ModuleNotFoundError: No module named 'app'` when running tests.
  **Fix:** run `pytest` from the repository root (it reads `pytest.ini`, which adds `backend/` to the path).
- **Problem:** `./scripts/setup.sh: Permission denied`.
  **Fix:** `bash scripts/setup.sh`, or `chmod +x scripts/*.sh` once.
- **Problem:** a `StarletteDeprecationWarning` about `httpx` appears in the test output.
  **Fix:** harmless for now (it comes from the test client library); the tests still pass.
