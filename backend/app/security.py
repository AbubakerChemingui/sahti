"""Passwords, session tokens and field encryption (SRS SEC-01, SEC-06, NFR-07).

MVP choices (recorded in ADR 0004):
* passwords: scrypt from the standard library, OWASP parameters (N=2^17, r=8, p=1);
* sessions: random opaque tokens stored as SHA-256 hashes, 12 h lifetime (no refresh tokens yet);
* health data: AES-256-GCM per record with a random 96-bit nonce (`cryptography` package).
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import secrets

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

_SCRYPT_N = int(os.getenv("SAHTI_SCRYPT_N", str(2 ** 17)))  # tests lower it to stay fast
_SCRYPT_R, _SCRYPT_P = 8, 1


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.scrypt(password.encode(), salt=salt, n=_SCRYPT_N, r=_SCRYPT_R, p=_SCRYPT_P,
                            maxmem=256 * 1024 * 1024, dklen=32)
    return f"scrypt${_SCRYPT_N}${base64.b64encode(salt).decode()}${base64.b64encode(digest).decode()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        _, n, salt, digest = stored.split("$")
        check = hashlib.scrypt(password.encode(), salt=base64.b64decode(salt), n=int(n), r=_SCRYPT_R,
                               p=_SCRYPT_P, maxmem=256 * 1024 * 1024, dklen=32)
        return hmac.compare_digest(check, base64.b64decode(digest))
    except (ValueError, TypeError):
        return False


def new_token() -> str:
    return secrets.token_urlsafe(32)


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


class FieldCipher:
    """AES-256-GCM for P3 health data. The key comes from SAHTI_FIELD_ENCRYPTION_KEY (never from code)."""

    def __init__(self, secret: str):
        # Any secret string is turned into a 32-byte key; a real deployment uses a long random value.
        self._aes = AESGCM(hashlib.sha256(secret.encode()).digest())

    def encrypt(self, value) -> str:
        nonce = secrets.token_bytes(12)
        data = self._aes.encrypt(nonce, json.dumps(value, ensure_ascii=False).encode(), None)
        return base64.b64encode(nonce + data).decode()

    def decrypt(self, blob: str):
        raw = base64.b64decode(blob)
        return json.loads(self._aes.decrypt(raw[:12], raw[12:], None).decode())
