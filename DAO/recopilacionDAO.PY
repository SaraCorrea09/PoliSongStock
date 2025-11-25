from database import get_connection
from Datos.Recopilacion import Recopilacion   # Ajusta si la ruta es distinta


class RecopilacionDAO:

    # ================================
    # CREAR RECOPILACIÓN
    # ================================
    def agregarRecopilacion(self, recopilacion) -> int:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO recopilaciones (usuario_id, nombre, descripcion, publica)
            VALUES (?, ?, ?, ?)
        """, (recopilacion.usuario_id, recopilacion.nombre, recopilacion.descripcion, int(recopilacion.publica)))

        conn.commit()
        return cur.lastrowid

    # ================================
    # ELIMINAR RECOPILACIÓN
    # ================================
    def eliminarRecopilacion(self, recop_id: int) -> None:
        conn = get_connection()
        cur = conn.cursor()

        # Borra canciones asociadas
        cur.execute("DELETE FROM recopilacion_canciones WHERE recopilacion_id=?", (recop_id,))
        # Borra recopilación
        cur.execute("DELETE FROM recopilaciones WHERE id=?", (recop_id,))

        conn.commit()

    # ================================
    # EDITAR RECOPILACIÓN
    # ================================
    def editarRecopilacion(self, recopilacion) -> None:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            UPDATE recopilaciones
            SET nombre=?, descripcion=?, publica=?
            WHERE id=?
        """, (recopilacion.nombre, recopilacion.descripcion, int(recopilacion.publica), recopilacion.id))

        conn.commit()

    # ================================
    # BUSCAR RECOPILACIÓN
    # ================================
    def buscarRecopilacion(self, recop_id: int):
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT id, usuario_id, nombre, descripcion, publica
            FROM recopilaciones
            WHERE id=?
        """, (recop_id,))

        fila = cur.fetchone()

        if not fila:
            return None

        recop = Recopilacion(
            id=fila[0],
            usuario_id=fila[1],
            nombre=fila[2],
            descripcion=fila[3],
            publica=bool(fila[4]),
            canciones=[]
        )

        # Obtener canciones asociadas
        cur.execute("""
            SELECT c.id, c.nombre, c.artista
            FROM recopilacion_canciones rc
            JOIN canciones_nueva c ON rc.cancion_id = c.id
            WHERE rc.recopilacion_id=?
        """, (recop_id,))

        recop.canciones = [
            {"id": f[0], "nombre": f[1], "artista": f[2]}
            for f in cur.fetchall()
        ]

        return recop
