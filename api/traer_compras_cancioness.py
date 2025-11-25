from flask import Blueprint, jsonify
from database import get_connection

bp = Blueprint('traer_compras_canciones', __name__, url_prefix='/api/traer-compras-canciones')


@bp.route('/comprador/<int:comprador_id>', methods=['GET'])
def traer_compras_canciones_comprador(comprador_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
    SELECT 
        cc.compra_id,
        cc.cancion_id,
        cc.comprador_id,
        cc.vendedor_id,
        cc.fecha_compra,
        c.nombre AS titulo,
        c.artista,
        c.genero,
        c.duracion,
        c.precio AS precio
    FROM compras_canciones cc
    JOIN canciones_nueva c ON cc.cancion_id = c.id
    WHERE cc.comprador_id = ?
"""


        cursor.execute(query, (comprador_id,))
        filas = cursor.fetchall()

        columnas = [col[0] for col in cursor.description]
        compras = [dict(zip(columnas, fila)) for fila in filas]

        return jsonify({
            "comprador_id": comprador_id,
            "total_compras": len(compras),
            "compras": compras
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Error al consultar las compras de canciones",
            "detalle": str(e)
        }), 500
