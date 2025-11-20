from flask import Blueprint, request, jsonify
import sqlite3
from datetime import datetime

bp = Blueprint('compras', __name__, url_prefix='/api/compras-vinilo')
DATABASE = 'polisongstock.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@bp.route('', methods=['POST'])
def crear_compra():
    try:
        # Obtener datos del request
        data = request.get_json()
        
        comprador_id = data.get('comprador_id')
        vendedor_id = data.get('vendedor_id')
        vinilo_id = data.get('vinilo_id')
        
        # Validar que todos los campos requeridos estén presentes
        if not all([comprador_id, vendedor_id, vinilo_id]):
            return jsonify({
                'error': 'Faltan campos requeridos',
                'campos_requeridos': ['comprador_id', 'vendedor_id', 'vinilo_id']
            }), 400
        
        # Obtener fecha y hora actual
        fecha_compra = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Conectar a la base de datos e insertar
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO compras 
            (comprador_id, vendedor_id, vinilo_id, fecha_compra, 
             vendedor_acepta, pago_enviado, compra_recibida)
            VALUES (?, ?, ?, ?, 1, 1, 1)
        ''', (comprador_id, vendedor_id, vinilo_id, fecha_compra))
        
        compra_id = cursor.lastrowid
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'mensaje': 'Compra registrada exitosamente',
            'compra': {
                'compra_id': compra_id,
                'comprador_id': comprador_id,
                'vendedor_id': vendedor_id,
                'vinilo_id': vinilo_id,
                'fecha_compra': fecha_compra,
                'vendedor_acepta': 1,
                'pago_enviado': 1,
                'compra_recibida': 1
            }
        }), 201
        
    except sqlite3.IntegrityError as e:
        return jsonify({
            'error': 'Error de integridad en la base de datos',
            'detalle': str(e)
        }), 400
        
    except Exception as e:
        return jsonify({
            'error': 'Error al procesar la solicitud',
            'detalle': str(e)
        }), 500

# Endpoint adicional para consultar una compra
@bp.route('/<int:compra_id>', methods=['GET'])
def obtener_compra(compra_id):
    try:
        conn = get_db_connection()
        compra = conn.execute(
            'SELECT * FROM compras WHERE compra_id = ?', 
            (compra_id,)
        ).fetchone()
        conn.close()
        
        if compra is None:
            return jsonify({'error': 'Compra no encontrada'}), 404
        
        return jsonify(dict(compra)), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Error al consultar la compra',
            'detalle': str(e)
        }), 500