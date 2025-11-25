import sqlite3
from flask import Blueprint, jsonify

DB_PATH = "polisongstock.db"

bp = Blueprint("canciones", __name__, url_prefix="/api/canciones")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# ======================================================
# LISTAR TODAS LAS CANCIONES (SIN IMÁGENES)
# ======================================================
@bp.get("/")
def listar_canciones():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            nombre,
            artista,
            genero,
            duracion,
            tamano_kb,
            calidad_kbps,
            precio,
            usuario_vendedor_id AS vendedor_id
        FROM canciones_nueva;
    """)

    filas = cursor.fetchall()
    conn.close()

    canciones = [dict(fila) for fila in filas]
    return jsonify(canciones), 200


# ======================================================
# OBTENER UNA CANCIÓN
# ======================================================
@bp.get("/<int:id>")
def obtener_cancion(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            nombre,
            artista,
            genero,
            duracion,
            tamano_kb,
            calidad_kbps,
            precio,
            usuario_vendedor_id AS vendedor_id
        FROM canciones_nueva
        WHERE id = ?;
    """, (id,))

    fila = cursor.fetchone()
    conn.close()

    if fila is None:
        return jsonify({"ok": False, "error": "Canción no encontrada"}), 404

    return jsonify(dict(fila)), 200


# ======================================================
# CREAR CANCIÓN (ADMIN)
# ======================================================
@bp.post("/")
def crear_cancion():
    from flask import request

    data = request.get_json()

    campos = [
        "nombre", "artista", "genero",
        "duracion", "tamano_kb",
        "calidad_kbps", "precio", "usuario_vendedor_id"
    ]

    if not all(k in data for k in campos):
        return jsonify({"ok": False, "error": "Faltan campos"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO canciones_nueva 
        (nombre, artista, genero, duracion, tamano_kb, calidad_kbps, precio, usuario_vendedor_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["nombre"], data["artista"], data["genero"],
        data["duracion"], data["tamano_kb"],
        data["calidad_kbps"], data["precio"],
        data["usuario_vendedor_id"]
    ))

    conn.commit()
    new_id = cur.lastrowid
    conn.close()

    return jsonify({"ok": True, "id": new_id}), 201


# ======================================================
# EDITAR CANCIÓN (ADMIN)
# ======================================================
@bp.put("/<int:id>")
def editar_cancion(id):
    from flask import request

    data = request.get_json(silent=True)

    if not data:
        return jsonify({"ok": False, "error": "JSON inválido"}), 400

    campos = {
        "nombre": "",
        "artista": "",
        "genero": "",
        "duracion": "",
        "tamano_kb": 0,
        "calidad_kbps": 0,
        "precio": 0,
        "vendedor_id": None
    }

    # Rellenar los valores recibidos
    for c in campos:
        if c not in data:
            return jsonify({"ok": False, "error": f"Falta el campo '{c}'"}), 400
        campos[c] = data[c]

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            UPDATE canciones_nueva
            SET nombre=?, artista=?, genero=?, duracion=?,
                tamano_kb=?, calidad_kbps=?, precio=?, usuario_vendedor_id=?
            WHERE id=?;
        """, (
            campos["nombre"],
            campos["artista"],
            campos["genero"],
            campos["duracion"],
            campos["tamano_kb"],
            campos["calidad_kbps"],
            campos["precio"],
            campos["vendedor_id"],
            id
        ))

        conn.commit()
        return jsonify({"ok": True}), 200

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

    finally:
        conn.close()



# ======================================================
# ELIMINAR CANCIÓN (ADMIN)
# ======================================================
@bp.delete("/<int:id>")
def eliminar_cancion(id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM canciones_nueva WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"ok": True}), 200
