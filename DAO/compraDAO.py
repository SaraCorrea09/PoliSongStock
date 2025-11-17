# compra_dao.py
from typing import Optional, List, Dict
from database import get_connection  


class CompraDAO:

    @staticmethod
    def buscar_por_id(compra_id: int) -> Optional[Dict]:
        conn = get_connection()
        try:
            cur = conn.cursor()
            cur.execute("""
                SELECT compra_id, usuario_id, cancion_id, fecha_compra,
                       vendedor_acepta, pago_enviado, compra_recibida, precio_total
                  FROM compras WHERE compra_id = ?;
            """, (compra_id,))
            row = cur.fetchone()
            if not row:
                return None
            return {
                "compra_id": row[0],
                "usuario_id": row[1],
                "cancion_id": row[2],
                "fecha_compra": row[3],
                "vendedor_acepta": bool(row[4]),
                "pago_enviado": bool(row[5]),
                "compra_recibida": bool(row[6]),
                "precio_total": float(row[7])
            }
        finally:
            conn.close()

    @staticmethod
    def listar(limit: int = 50, offset: int = 0, estado: Optional[str] = None, usuario_id: Optional[int] = None) -> List[Dict]:
        conn = get_connection()
        try:
            cur = conn.cursor()

            query = """
                SELECT compra_id, usuario_id, cancion_id, fecha_compra,
                       vendedor_acepta, pago_enviado, compra_recibida, precio_total
                  FROM compras
            """
            filters = []
            params = []

            if estado:
                if estado == "pendiente":
                    filters.append("vendedor_acepta = 0 AND pago_enviado = 0 AND compra_recibida = 0")
                elif estado == "en_proceso":
                    filters.append("vendedor_acepta = 1 AND pago_enviado = 1 AND compra_recibida = 0")
                elif estado == "completada":
                    filters.append("vendedor_acepta = 1 AND pago_enviado = 1 AND compra_recibida = 1")

            if usuario_id is not None:
                filters.append("usuario_id = ?")
                params.append(usuario_id)

            if filters:
                query += " WHERE " + " AND ".join(filters)

            query += " ORDER BY compra_id LIMIT ? OFFSET ?"
            params.extend([limit, offset])

            cur.execute(query, params)
            rows = cur.fetchall()
            
            compras = []
            for row in rows:
                compras.append({
                    "compra_id": row[0],
                    "usuario_id": row[1],
                    "cancion_id": row[2],
                    "fecha_compra": row[3],
                    "vendedor_acepta": bool(row[4]),
                    "pago_enviado": bool(row[5]),
                    "compra_recibida": bool(row[6]),
                    "precio_total": float(row[7])
                })
            return compras
        finally:
            conn.close()

    @staticmethod
    def actualizar(estados: Dict, compra_id: int) -> bool:
        """
        estados: dict con las llaves vendedor_acepta, pago_enviado, compra_recibida (opcional)
        """
        conn = get_connection()
        try:
            cur = conn.cursor()
            # Actualizar solo los estados pasados en el diccionario
            campos = []
            valores = []

            for key in ['vendedor_acepta', 'pago_enviado', 'compra_recibida']:
                if key in estados:
                    campos.append(f"{key} = ?")
                    valores.append(int(estados[key]))

            if not campos:
                return False  # Nada que actualizar

            valores.append(compra_id)
            sql = f"UPDATE compras SET {', '.join(campos)} WHERE compra_id = ?"
            cur.execute(sql, valores)
            conn.commit()
            return cur.rowcount > 0
        finally:
            conn.close()
