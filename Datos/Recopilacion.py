# ---------------------------------------------------------
# Clase: Recopilacion
# Descripción: Representa una recopilación creada por un usuario,
# que agrupa varias canciones del sistema.
# ---------------------------------------------------------

class Recopilacion:
    def __init__(self, id: int, usuario_id: int, nombre: str, descripcion: str, publica: bool, canciones=None):
        self.id = id
        self.usuario_id = usuario_id
        self.nombre = nombre
        self.descripcion = descripcion
        self.publica = publica
        self.canciones = canciones if canciones is not None else []

