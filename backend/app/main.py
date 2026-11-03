"""FastAPI application entry point.

Run locally:  uvicorn app.main:app --reload --app-dir backend
Only the health endpoint exists so far (SRS API-26); features follow the SRS.
"""
from __future__ import annotations

from fastapi import FastAPI

from app import __version__

app = FastAPI(title="Sahti API", version=__version__)


@app.get("/api/v1/health")
def health() -> dict:
    """Liveness check (SRS API-26). Never returns personal data.

    activeDataVersion and modelVersion stay null until clinical data import
    (FR-39) and the model registry (SDD ADR-23) are implemented.
    """
    return {"status": "ok", "activeDataVersion": None, "modelVersion": None}
