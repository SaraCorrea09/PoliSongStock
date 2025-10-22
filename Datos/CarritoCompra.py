# ---------------------------------------------------------
# Clase: CarritoCompra
# Descripción: Representa un carrito de compras asociado a un usuario.
# Permite almacenar los productos seleccionados antes de realizar la compra.
# ---------------------------------------------------------

class CarritoCompra:
    def __init__(self, id: int, fecha_creacion: str):
        # Identificador único del carrito de compras
        self.id = id
        
        # Fecha de creación del carrito
        self.fecha_creacion = fecha_creacion
