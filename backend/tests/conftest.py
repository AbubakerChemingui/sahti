"""Test settings: fast password hashing and an in-memory database, set before the app is imported."""
import os

os.environ["SAHTI_SCRYPT_N"] = "1024"
os.environ["SAHTI_DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SAHTI_PUBLIC_DEPLOYMENT"] = "false"
os.environ["SAHTI_FIELD_ENCRYPTION_KEY"] = "test-only-key"
