import os
import sqlite3
from pathlib import Path

# Set CRN_DB_PATH to choose another database location.
DB_PATH = Path(os.environ.get("CRN_DB_PATH", "crn.db"))

def get_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=30)
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def initialize_database():
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS resource_sources (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                facility_name TEXT NOT NULL,
                facility_type TEXT NOT NULL,
                resource_type TEXT NOT NULL,
                quantity REAL NOT NULL CHECK(quantity > 0),
                unit TEXT NOT NULL,
                temperature REAL,
                location TEXT NOT NULL,
                description TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS resource_consumers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                facility_name TEXT NOT NULL,
                facility_type TEXT NOT NULL,
                required_resource TEXT NOT NULL,
                required_quantity REAL NOT NULL CHECK(required_quantity > 0),
                unit TEXT NOT NULL,
                required_temperature REAL,
                location TEXT NOT NULL,
                description TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)

def add_source(data):
    with get_connection() as conn:
        conn.execute("""
            INSERT INTO resource_sources
            (facility_name, facility_type, resource_type, quantity, unit,
             temperature, location, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, data)

def add_consumer(data):
    with get_connection() as conn:
        conn.execute("""
            INSERT INTO resource_consumers
            (facility_name, facility_type, required_resource, required_quantity,
             unit, required_temperature, location, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, data)

def get_sources():
    with get_connection() as conn:
        return conn.execute("""
            SELECT id, facility_name, facility_type, resource_type, quantity,
                   unit, temperature, location, description, created_at
            FROM resource_sources ORDER BY id DESC
        """).fetchall()

def get_consumers():
    with get_connection() as conn:
        return conn.execute("""
            SELECT id, facility_name, facility_type, required_resource,
                   required_quantity, unit, required_temperature,
                   location, description, created_at
            FROM resource_consumers ORDER BY id DESC
        """).fetchall()

def delete_source(record_id):
    with get_connection() as conn:
        conn.execute("DELETE FROM resource_sources WHERE id = ?", (record_id,))

def delete_consumer(record_id):
    with get_connection() as conn:
        conn.execute("DELETE FROM resource_consumers WHERE id = ?", (record_id,))

def get_counts():
    with get_connection() as conn:
        source_count = conn.execute(
            "SELECT COUNT(*) FROM resource_sources"
        ).fetchone()[0]
        consumer_count = conn.execute(
            "SELECT COUNT(*) FROM resource_consumers"
        ).fetchone()[0]
    return source_count, consumer_count
