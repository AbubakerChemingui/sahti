"""Settings read from environment variables (see .env.example). No secrets in code."""
from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


def _flag(name: str, default: bool = False) -> bool:
    return os.getenv(name, str(default)).strip().lower() in {"1", "true", "yes"}


def _load_dotenv() -> None:
    """Read KEY=VALUE lines from the repo's .env into the environment (existing variables win)."""
    path = Path(__file__).resolve().parents[2] / ".env"
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip())


@dataclass(frozen=True)
class Settings:
    database_url: str
    public_deployment: bool  # SRS FR-39 / NFR-23: DRAFT clinical data is refused when True
    encryption_secret: str
    clinical_bundle: str

    @classmethod
    def from_env(cls) -> "Settings":
        _load_dotenv()
        return cls(
            database_url=os.getenv("SAHTI_DATABASE_URL", "sqlite:///./sahti.db"),
            public_deployment=_flag("SAHTI_PUBLIC_DEPLOYMENT", False),
            encryption_secret=os.getenv("SAHTI_FIELD_ENCRYPTION_KEY", "local-demo-key-change-me"),
            clinical_bundle=os.getenv("SAHTI_CLINICAL_BUNDLE", "demo_v1"),
        )
