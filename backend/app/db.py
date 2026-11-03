"""SQLite persistence for the course demo (design ADR-13): portable SQL only, one data-access module."""
from __future__ import annotations

import sqlite3
import threading
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
    language TEXT NOT NULL, consent_at TEXT, disclaimer_at TEXT, audit_key TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY, user_id TEXT NOT NULL, relation TEXT NOT NULL, data_enc TEXT NOT NULL,
    version INTEGER NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS consultations (
    id TEXT PRIMARY KEY, user_id TEXT NOT NULL, profile_id TEXT NOT NULL, status TEXT NOT NULL,
    result_type TEXT, started_at TEXT NOT NULL, completed_at TEXT, state_enc TEXT NOT NULL, version INTEGER NOT NULL,
    expiry_notified INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS audit_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT, actor_hash TEXT, action TEXT NOT NULL, summary TEXT, created_at TEXT NOT NULL);
"""


class Database:
    def __init__(self, url: str):
        path = url.replace("sqlite:///", "", 1) if url.startswith("sqlite:///") else url
        if path != ":memory:":
            Path(path).parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(path, check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._lock = threading.Lock()
        with self._lock:
            self._conn.executescript(SCHEMA)
            self._conn.commit()

    def execute(self, sql: str, params: tuple = ()) -> None:
        with self._lock:
            self._conn.execute(sql, params)
            self._conn.commit()

    def one(self, sql: str, params: tuple = ()):
        with self._lock:
            return self._conn.execute(sql, params).fetchone()

    def all(self, sql: str, params: tuple = ()) -> list:
        with self._lock:
            return self._conn.execute(sql, params).fetchall()
