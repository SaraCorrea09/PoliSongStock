# DAO/compraDAO.py

from database import get_connection

class CompraDAO:
    @staticmethod
    def listar(limit=50, offset=0, estado=None, comprador_id=None):
        conn = get_connection()
        try:
            cur = conn.cursor()
            query = "SELECT compra_id, comprador_id, vendedor_id, vinilo_id, fecha_compra, vendedor_acepta, pago_enviado, compra_recibida FROM Compras"
            filters = []
            params = []
            if estado:
                if estado == "pendiente":
                    filters.append("vendedor_acepta=0 AND pago_enviado=0 AND compra_recibida=0")
                elif estado == "en_proceso":
                    filters.append("vendedor_acepta=1 AND pago_enviado=1 AND compra_recibida=0")
                elif estado == "completada":
                    filters.append("vendedor_acepta=1 AND pago_enviado=1 AND compra_recibida=1")
            if comprador_id:
                filters.append("comprador_id=?")
                params.append(comprador_id)
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
                    "comprador_id": row[1],
                    "vendedor_id": row[2],
                    "vinilo_id": row[3],
                    "fecha_compra": row[4],
                    "vendedor_acepta": row[5],
                    "pago_enviado": row[6],
                    "compra_recibida": row[7]
                })
            return compras
        finally:
            conn.close()
