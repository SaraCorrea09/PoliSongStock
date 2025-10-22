# ---------------------------------------------------------
# Clase: Vinilo
# Descripción: Representa un disco de vinilo disponible en el sistema.
# Contiene su información básica y comercial.
# ---------------------------------------------------------

class Vinilo:
    def __init__(self, id: int, nombre: str, artista: str, genero: str, cantidad: int, precio: float):
        # Identificador único del vinilo
        self.id = id
        
        # Nombre del vinilo
        self.nombre = nombre
        
        # Nombre del artista o banda
        self.artista = artista
        
        # Género musical (Ej: "Rock", "Pop", "Jazz")
        self.genero = genero
        
        # Cantidad disponible en inventario
        self.cantidad = cantidad
        
        # Precio de venta del vinilo
        self.precio = precio
