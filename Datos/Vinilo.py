# ---------------------------------------------------------
# Clase: Vinilo
# Descripción: Representa un disco de vinilo disponible en el sistema.
# Contiene su información básica y comercial.
# ---------------------------------------------------------

class Vinilo:
    def __init__(self, vinilo_id, nombre, artista, año, precio, cantidad, vendedor_id):
        self.vinilo_id = vinilo_id
        self.nombre = nombre
        self.artista = artista
        self.año = año
        self.precio = precio
        self.cantidad = cantidad
        self.vendedor_id = vendedor_id
