# ---------------------------------------------------------
# Clase: Recopilacion
# Descripción: Representa una recopilación creada por un usuario,
# que agrupa varias canciones del sistema.
# ---------------------------------------------------------

class Recopilacion:
    def __init__(self, id: int, nombre: str, es_publica: bool):
        # Identificador único de la recopilación
        self.id = id
        
        # Nombre asignado a la recopilación
        self.nombre = nombre
        
        # Indica si la recopilación es pública o privada
        self.es_publica = es_publica
