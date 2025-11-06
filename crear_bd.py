import sqlite3

conn = sqlite3.connect("polisongstock.db")
c = conn.cursor()

# --- Tabla de usuarios ---
c.execute('''
CREATE TABLE IF NOT EXISTS Usuarios (
    usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    correo TEXT,
    contraseña TEXT,
    telefono TEXT,
    rol TEXT
)
''')

# --- Tabla de vinilos ---
c.execute('''
CREATE TABLE IF NOT EXISTS Vinilos (
    vinilo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    artista TEXT,
    año INTEGER,
    precio REAL,
    cantidad INTEGER,
    vendedor_id INTEGER,
    FOREIGN KEY (vendedor_id) REFERENCES Usuarios(usuario_id)
)
''')

# --- Tabla de canciones ---
c.execute('''
CREATE TABLE IF NOT EXISTS Canciones (
    cancion_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    artista TEXT,
    genero TEXT,
    duracion TEXT,
    tamaño_mb REAL,
    calidad_kbps INTEGER,
    precio REAL
)
''')

# --- Relación ViniloCancion ---
c.execute('''
CREATE TABLE IF NOT EXISTS ViniloCancion (
    vinilo_id INTEGER,
    cancion_id INTEGER,
    FOREIGN KEY (vinilo_id) REFERENCES Vinilos(vinilo_id),
    FOREIGN KEY (cancion_id) REFERENCES Canciones(cancion_id)
)
''')

conn.commit()
conn.close()
print("✅ Base de datos 'polisongstock.db' creada con todas las tablas.")
