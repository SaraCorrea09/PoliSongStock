import sqlite3
from flask import Blueprint, jsonify

# Ruta al archivo de base de datos SQLite
DB_PATH = "polisongstock.db"

# Definimos el blueprint de vinilos
bp = Blueprint("vinilos", __name__, url_prefix="/api/vinilos")


def get_db_connection():
    """
    Abre una conexión a la base de datos SQLite y configura row_factory
    para devolver filas tipo diccionario.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@bp.get("/")
def listar_vinilos():
    """
    Devuelve todos los vinilos de la base de datos en formato JSON.
    IMPORTANTE: Ajusta el nombre de la tabla si no se llama exactamente 'vinilos'.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # 🔴 Si tu tabla NO se llama 'vinilos', luego cambiamos este nombre.
    cursor.execute("SELECT * FROM vinilos;")

    filas = cursor.fetchall()
    conn.close()

    vinilos = [dict(fila) for fila in filas]

    return jsonify(vinilos), 200

@bp.get("/<int:vinilo_id>")
def obtener_vinilo(vinilo_id):
    """
    Devuelve un solo vinilo por su ID.
    Ejemplo: GET /api/vinilos/1
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM vinilos WHERE vinilo_id = ?;", (vinilo_id,))
    fila = cursor.fetchone()
    conn.close()

    if fila is None:
        # Si no existe, devolvemos 404
        return jsonify({"error": "Vinilo no encontrado"}), 404

    return jsonify(dict(fila)), 200
