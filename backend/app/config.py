"""Settings read from environment variables (see .env.example). No secrets in code."""
from __future__ import annotations

import os
from dataclasses import dataclass


def _flag(name: str, default: bool = False) -> bool:
    return os.getenv(name, str(default)).strip().lower() in {"1", "true", "yes"}


@dataclass(frozen=True)
class Settings:
    database_url: str
    public_deployment: bool  # SRS FR-39 / NFR-23: DRAFT clinical data is refused when True

    @classmethod
    def from_env(cls) -> "Settings":
        return cls(
            database_url=os.getenv("SAHTI_DATABASE_URL", "sqlite:///./sahti.db"),
            public_deployment=_flag("SAHTI_PUBLIC_DEPLOYMENT", False),
        )
