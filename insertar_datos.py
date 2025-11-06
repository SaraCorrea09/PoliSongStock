import sqlite3

conn = sqlite3.connect("polisongstock.db")
c = conn.cursor()

# Usuario vendedor
c.execute("INSERT INTO Usuarios (nombre, correo, contraseña, telefono, rol) VALUES (?, ?, ?, ?, ?)",
          ("Carlos Vinilos", "carlos@music.com", "123", "3001234567", "vendedor"))

# Vinilos
c.execute("INSERT INTO Vinilos (nombre, artista, año, precio, cantidad, vendedor_id) VALUES (?, ?, ?, ?, ?, ?)",
          ("Dark Side of the Moon", "Pink Floyd", 1973, 120000, 5, 1))
c.execute("INSERT INTO Vinilos (nombre, artista, año, precio, cantidad, vendedor_id) VALUES (?, ?, ?, ?, ?, ?)",
          ("Kind of Blue", "Miles Davis", 1959, 95000, 2, 1))

conn.commit()
conn.close()
print("Datos de prueba insertados correctamente.")
