from flask import Blueprint, request, jsonify
import sqlite3

bp = Blueprint('traer_compras_vinilos', __name__, url_prefix='/api/traer-compras-vinilos')
DATABASE = 'polisongstock.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@bp.route('/comprador/<int:comprador_id>', methods=['GET'])
def traer_compras_vinilos_comprador(comprador_id):
    try:
        conn = get_db_connection()
        
        query = """
            SELECT 
                c.compra_id,
                c.comprador_id,
                c.vendedor_id,
                c.vinilo_id,
                c.fecha_compra,
                c.vendedor_acepta,
                c.pago_enviado,
                c.compra_recibida,
                
                v.nombre AS nombre_vinilo,
                v.artista,
                v.anio,
                v.precio,
                v.cantidad
            FROM Compras c
            JOIN vinilos v ON c.vinilo_id = v.vinilo_id
            WHERE c.comprador_id = ?
        """
        
        compras = conn.execute(query, (comprador_id,)).fetchall()
        conn.close()

        if not compras:
            return jsonify({
                'mensaje': 'No se encontraron compras de vinilos para este comprador',
                'comprador_id': comprador_id,
                'compras': []
            }), 200

        compras_list = [dict(compra) for compra in compras]

        return jsonify({
            'comprador_id': comprador_id,
            'total_compras': len(compras_list),
            'compras': compras_list
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Error al consultar las compras de vinilos',
            'detalle': str(e)
        }), 500
