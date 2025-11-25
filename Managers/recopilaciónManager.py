from Datos.RecopilacionDAO import RecopilacionDAO
from database import get_connection


class RecopilacionManager:

    def __init__(self):
        self.dao = RecopilacionDAO()

    # ================================
    # CREAR
    # ================================
    def crearRecopilacion(self, recop) -> int:
        return self.dao.agregarRecopilacion(recop)

    # ================================
    # AGREGAR CANCIÓN
    # ================================
    def agregarCancion(self, recop_id: int, cancion_id: int) -> None:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO recopilacion_canciones (recopilacion_id, cancion_id)
            VALUES (?, ?)
        """, (recop_id, cancion_id))

        conn.commit()

    # ================================
    # ELIMINAR CANCIÓN
    # ================================
    def eliminarCancion(self, recop_id: int, cancion_id: int) -> None:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            DELETE FROM recopilacion_canciones
            WHERE recopilacion_id=? AND cancion_id=?
        """, (recop_id, cancion_id))

        conn.commit()
