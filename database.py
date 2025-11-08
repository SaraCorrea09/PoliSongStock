import sqlite3
from pathlib import Path

DB_NAME = "polisongstock.db"

def get_connection():
    db_path = Path(__file__).with_name(DB_NAME)
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys = ON;")
    # Si quieres acceder a columnas por nombre:
    # conn.row_factory = sqlite3.Row
    return conn
