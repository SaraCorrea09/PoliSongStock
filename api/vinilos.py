import sqlite3
from flask import Blueprint, jsonify, request

DB_PATH = "polisongstock.db"

bp = Blueprint("vinilos", __name__, url_prefix="/api/vinilos")


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@bp.route("/", methods=["GET"], strict_slashes=False)
def listar_vinilos():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM vinilos;")
    filas = cursor.fetchall()
    conn.close()
    vinilos = [dict(fila) for fila in filas]
    return jsonify(vinilos), 200


@bp.route("/<int:vinilo_id>", methods=["GET"], strict_slashes=False)
def obtener_vinilo(vinilo_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM vinilos WHERE vinilo_id = ?;", (vinilo_id,))
    fila = cursor.fetchone()
    conn.close()
    
    if fila is None:
        return jsonify({"error": "Vinilo no encontrado"}), 404
    
    return jsonify(dict(fila)), 200


@bp.route("/", methods=["POST"], strict_slashes=False)
def crear_vinilo():
    data = request.get_json() or {}
    
    # ahora requerimos usuario_id (tu DB ya usa usuario_id)
    campos = ["nombre", "artista", "anio", "precio", "cantidad", "usuario_id"]
    
    if not all(c in data for c in campos):
        return jsonify({"error": "Faltan campos obligatorios"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        """
        INSERT INTO vinilos (nombre, artista, anio, precio, cantidad, usuario_id)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (data["nombre"], data["artista"], data["anio"], 
         data["precio"], data["cantidad"], data["usuario_id"])
    )
    
    conn.commit()
    nuevo_id = cursor.lastrowid
    conn.close()
    
    return jsonify({"ok": True, "vinilo_id": nuevo_id}), 201

@bp.route("/<int:vinilo_id>", methods=["PUT"], strict_slashes=False)
def actualizar_vinilo(vinilo_id):
    data = request.get_json() or {}
    
    campos = ["nombre", "artista", "anio", "precio", "cantidad"]
    if not all(c in data for c in campos):
        return jsonify({"error": "Faltan campos para actualizar"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE vinilos
        SET nombre = ?, artista = ?, anio = ?, precio = ?, cantidad = ?
        WHERE vinilo_id = ?
        """,
        (data["nombre"], data["artista"], data["anio"], data["precio"], data["cantidad"], vinilo_id)
    )

    conn.commit()
    conn.close()

    return jsonify({"ok": True, "mensaje": "Vinilo actualizado correctamente"}), 200

@bp.route("/<int:vinilo_id>", methods=["DELETE"], strict_slashes=False)
def eliminar_vinilo(vinilo_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM vinilos WHERE vinilo_id = ?;", (vinilo_id,))
    cambios = cursor.rowcount  # saber si borró algo

    conn.commit()
    conn.close()

    if cambios == 0:
        return jsonify({"error": "Vinilo no encontrado"}), 404

    return jsonify({"ok": True, "mensaje": "Vinilo eliminado correctamente"}), 200
