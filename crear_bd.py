import sqlite3
from pathlib import Path

DB_NAME = "polisongstock.db"

def create_db():
    db_path = Path(__file__).with_name(DB_NAME)
    conn = sqlite3.connect(db_path)
    try:
        conn.execute("PRAGMA foreign_keys = ON;")
        c = conn.cursor()

        c.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre     TEXT NOT NULL,
            correo     TEXT NOT NULL UNIQUE,
            contrasena TEXT NOT NULL,
            telefono   TEXT,
            rol        TEXT NOT NULL DEFAULT 'buyer'
        );
        """)

        c.execute("""
        CREATE TABLE IF NOT EXISTS vinilos (
            vinilo_id   INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre      TEXT NOT NULL,
            artista     TEXT NOT NULL,
            anio        INTEGER,
            precio      REAL,
            cantidad    INTEGER,
            vendedor_id INTEGER,
            FOREIGN KEY (vendedor_id) REFERENCES usuarios(usuario_id)
        );
        """)

        c.execute("""
        CREATE TABLE IF NOT EXISTS canciones (
            cancion_id   INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre       TEXT NOT NULL,
            artista      TEXT NOT NULL,
            genero       TEXT,
            duracion     INTEGER,
            tamano_mb    REAL,
            calidad_kbps INTEGER,
            precio       REAL
        );
        """)

        c.execute("""
        CREATE TABLE IF NOT EXISTS vinilo_cancion (
            vinilo_id  INTEGER,
            cancion_id INTEGER,
            PRIMARY KEY (vinilo_id, cancion_id),
            FOREIGN KEY (vinilo_id)  REFERENCES vinilos(vinilo_id)   ON DELETE CASCADE,
            FOREIGN KEY (cancion_id) REFERENCES canciones(cancion_id) ON DELETE CASCADE
        );
        """)

        conn.commit()
        print("✅ Base de datos 'polisongstock.db' creada con todas las tablas.")
    finally:
        conn.close()

if __name__ == "__main__":
    create_db()
