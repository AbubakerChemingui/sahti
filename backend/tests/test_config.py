from app.config import Settings


def test_defaults_are_local_demo(monkeypatch):
    monkeypatch.delenv("SAHTI_DATABASE_URL", raising=False)
    monkeypatch.delenv("SAHTI_PUBLIC_DEPLOYMENT", raising=False)
    settings = Settings.from_env()
    assert settings.database_url.startswith("sqlite")
    assert settings.public_deployment is False


def test_public_deployment_flag(monkeypatch):
    monkeypatch.setenv("SAHTI_PUBLIC_DEPLOYMENT", "true")
    assert Settings.from_env().public_deployment is True
