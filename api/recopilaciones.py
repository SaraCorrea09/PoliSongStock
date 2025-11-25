from flask import Blueprint, request, jsonify
from database import get_connection
import sqlite3

bp = Blueprint("recopilaciones_api", __name__, url_prefix="/api/recopilaciones")


# ======================================================
# OBTENER RECOPILACIONES PROPIAS
# ======================================================
@bp.get("/mias/<int:usuario_id>")
def obtener_mias(usuario_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT *
        FROM recopilaciones
        WHERE usuario_id = ?
    """, (usuario_id,))

    columnas = [c[0] for c in cur.description]
    recs = [dict(zip(columnas, fila)) for fila in cur.fetchall()]

    # Añadir canciones
    for r in recs:
        cur.execute("""
            SELECT c.id, c.nombre, c.artista 
            FROM recopilacion_canciones rc
            JOIN canciones_nueva c ON rc.cancion_id = c.id
            WHERE rc.recopilacion_id = ?
        """, (r["id"],))
        r["canciones"] = [
            {"id": f[0], "nombre": f[1], "artista": f[2]}
            for f in cur.fetchall()
        ]

    conn.close()
    return jsonify({"ok": True, "recopilaciones": recs})


# ======================================================
# CREAR RECOPILACIÓN
# ======================================================
@bp.post("")
def crear():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"ok": False, "error": "JSON inválido"}), 400

    usuario_id = data.get("usuario_id")
    nombre = (data.get("nombre") or "").strip()
    descripcion = data.get("descripcion") or ""
    publica = int(bool(data.get("publica")))

    if not usuario_id or not nombre:
        return jsonify({
            "ok": False,
            "error": "Faltan campos requeridos"
        }), 400

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO recopilaciones (usuario_id, nombre, descripcion, publica)
        VALUES (?, ?, ?, ?)
    """, (usuario_id, nombre, descripcion, publica))

    conn.commit()
    new_id = cur.lastrowid
    conn.close()

    return jsonify({"ok": True, "id": new_id}), 201


# ======================================================
# EDITAR
# ======================================================
@bp.put("/<int:id>")
def editar(id):
    data = request.json
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE recopilaciones
        SET nombre=?, descripcion=?, publica=?
        WHERE id=?
    """, (data["nombre"], data["descripcion"], int(data["publica"]), id))

    conn.commit()
    conn.close()
    return jsonify({"ok": True})


# ======================================================
# ELIMINAR
# ======================================================
@bp.delete("/<int:id>")
def eliminar(id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM recopilaciones WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


# ======================================================
# RECOPILACIONES PÚBLICAS (CON CANCIONES)
# ======================================================
@bp.get("/publicas")
def listar_publicas():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT r.id, r.nombre, r.descripcion, r.usuario_id,
               u.nombre AS usuario
        FROM recopilaciones r
        JOIN usuarios u ON r.usuario_id = u.usuario_id
        WHERE r.publica = 1
    """)

    columnas = [c[0] for c in cur.description]
    recs = [dict(zip(columnas, fila)) for fila in cur.fetchall()]

    # *** AQUI SE AGREGA LA LISTA DE CANCIONES ***
    for r in recs:
        cur.execute("""
            SELECT c.id, c.nombre, c.artista
            FROM recopilacion_canciones rc
            JOIN canciones_nueva c ON rc.cancion_id = c.id
            WHERE rc.recopilacion_id = ?
        """, (r["id"],))
        r["canciones"] = [
            {"id": f[0], "nombre": f[1], "artista": f[2]}
            for f in cur.fetchall()
        ]

    conn.close()
    return jsonify({"ok": True, "recopilaciones": recs})


# ======================================================
# AGREGAR CANCIÓN
# ======================================================
@bp.post("/<int:id>/agregar-cancion")
def agregar_cancion(id):
    data = request.json

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO recopilacion_canciones (recopilacion_id, cancion_id)
        VALUES (?, ?)
    """, (id, data["cancion_id"]))

    conn.commit()
    conn.close()
    return jsonify({"ok": True})


# ======================================================
# ELIMINAR CANCIÓN
# ======================================================
@bp.delete("/<int:id>/eliminar-cancion/<int:cancion_id>")
def eliminar_cancion(id, cancion_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        DELETE FROM recopilacion_canciones 
        WHERE recopilacion_id=? AND cancion_id=?
    """, (id, cancion_id))

    conn.commit()
    conn.close()
    return jsonify({"ok": True})

@bp.get("/publicas/<int:recopilacion_id>")
def obtener_publica_con_canciones(recopilacion_id):
    conn = get_connection()
    cur = conn.cursor()

    try:
        # Obtener datos de la recopilación + nombre del autor
        cur.execute("""
            SELECT r.id, r.nombre, r.descripcion, r.publica,
                   u.nombre AS usuario
            FROM recopilaciones r
            JOIN usuarios u ON r.usuario_id = u.usuario_id
            WHERE r.id = ? AND r.publica = 1
        """, (recopilacion_id,))
        
        fila = cur.fetchone()

        if not fila:
            return jsonify({"ok": False, "error": "Recopilación no encontrada o no es pública"}), 404

        columnas = [c[0] for c in cur.description]
        recopilacion = dict(zip(columnas, fila))

        # Obtener canciones
        cur.execute("""
            SELECT 
                c.id AS cancion_id,
                c.nombre,
                c.artista,
                c.duracion
            FROM recopilacion_canciones rc
            JOIN canciones_nueva c ON rc.cancion_id = c.id
            WHERE rc.recopilacion_id = ?
        """, (recopilacion_id,))

        canciones = [
            {"cancion_id": f[0], "nombre": f[1], "artista": f[2], "duracion": f[3]}
            for f in cur.fetchall()
        ]

        recopilacion["canciones"] = canciones

        return jsonify({
            "ok": True,
            "recopilacion": recopilacion
        }), 200

    except Exception as e:
        print("ERROR obtener publica:", e)
        return jsonify({
            "ok": False,
            "error": "Error al obtener la recopilación pública",
            "detalle": str(e)
        }), 500

