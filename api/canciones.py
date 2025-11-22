import sqlite3
from flask import Blueprint, jsonify

# Ruta al archivo de base de datos SQLite.
# Si tu app se ejecuta desde la carpeta raíz del proyecto y ahí está polisongstock.db,
# esta ruta relativa funciona bien.
DB_PATH = "polisongstock.db"

# Definimos el blueprint de canciones
bp = Blueprint("canciones", __name__, url_prefix="/api/canciones")


def get_db_connection():
    """
    Abre una conexión a la base de datos SQLite y configura row_factory
    para devolver filas tipo diccionario.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@bp.get("/")
def listar_canciones():
    """
    Devuelve todas las canciones de la base de datos en formato JSON.
    IMPORTANTE: Ajusta el nombre de la tabla si no se llama exactamente 'canciones'.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # 🔴 Verificar tabla canciones.
    cursor.execute("SELECT * FROM canciones_nueva;")

    filas = cursor.fetchall()
    conn.close()

    # Convertimos cada fila (Row) en dict para poder serializar a JSON
    canciones = [dict(fila) for fila in filas]

    return jsonify(canciones), 200
