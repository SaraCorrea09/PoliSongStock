from flask import Blueprint, request, jsonify
import sqlite3

bp = Blueprint('traer_compras_canciones', __name__, url_prefix='/api/traer-compras-canciones')
DATABASE = 'polisongstock.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@bp.route('/comprador/<int:comprador_id>', methods=['GET'])
def traer_compras_canciones_comprador(comprador_id):
    try:
        conn = get_db_connection()
        compras = conn.execute(
            'SELECT * FROM compras_canciones WHERE comprador_id = ?', 
            (comprador_id,)
        ).fetchall()
        conn.close()
        
        if not compras:
            return jsonify({
                'mensaje': 'No se encontraron compras de canciones para este comprador',
                'comprador_id': comprador_id,
                'compras': []
            }), 200
        
        # Convertir las filas a diccionarios
        compras_list = [dict(compra) for compra in compras]
        
        return jsonify({
            'comprador_id': comprador_id,
            'total_compras': len(compras_list),
            'compras': compras_list
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Error al consultar las compras de canciones',
            'detalle': str(e)
        }), 500