from database import get_connection

def insertar_ejemplos():
    conn = get_connection()
    cur = conn.cursor()
    try:
        # Usuarios
        cur.execute("""
        INSERT OR IGNORE INTO usuarios (nombre, correo, contrasena, telefono, rol)
        VALUES
        ('Juan Perez', 'juan@example.com', '12345', '3001234567', 'seller'),
        ('Ana Gomez', 'ana@example.com', 'abcde', '3009876543', 'buyer');
        """)

        # Vinilos
        cur.execute("""
        INSERT INTO vinilos (nombre, artista, anio, precio, cantidad, vendedor_id)
        VALUES
        ('Kind of Blue', 'Miles Davis', 1959, 150000, 2,
         (SELECT usuario_id FROM usuarios WHERE correo='juan@example.com')),
        ('The Dark Side of the Moon', 'Pink Floyd', 1973, 120000, 1,
         (SELECT usuario_id FROM usuarios WHERE correo='juan@example.com'));
        """)

        # Canciones
        cur.execute("""
        INSERT INTO canciones (nombre, artista, genero, duracion, tamano_mb, calidad_kbps, precio)
        VALUES
        ('So What', 'Miles Davis', 'Jazz', 545, 12.3, 320, 50000),
        ('Time', 'Pink Floyd', 'Rock', 413, 10.1, 320, 60000);
        """)

        # Relación vinilo ↔ canción
        cur.execute("""
        INSERT INTO vinilo_cancion (vinilo_id, cancion_id)
        SELECT v.vinilo_id, c.cancion_id
        FROM vinilos v, canciones c
        WHERE (v.nombre='Kind of Blue' AND c.nombre='So What')
           OR (v.nombre='The Dark Side of the Moon' AND c.nombre='Time');
        """)

        conn.commit()
        print("✅ Datos insertados correctamente.")
    finally:
        conn.close()

def ver_datos():
    conn = get_connection()
    cur = conn.cursor()
    print("\n🎵 Canciones por vinilo:")
    for row in cur.execute("""
        SELECT v.nombre AS vinilo, c.nombre AS cancion, c.artista, c.genero
        FROM vinilo_cancion vc
        JOIN vinilos v ON v.vinilo_id = vc.vinilo_id
        JOIN canciones c ON c.cancion_id = vc.cancion_id;
    """):
        print(row)
    conn.close()

if __name__ == "__main__":
    insertar_ejemplos()
    ver_datos()
