# ---------------------------------------------------------
# Clase: OrdenDetalle
# Descripción: Representa el detalle de una orden, es decir,
# cada producto incluido en una compra con su cantidad y precio.
# ---------------------------------------------------------

class OrdenDetalle:
    def __init__(self, id: int, cantidad: int, precio_unitario: float):
        # Identificador único del detalle
        self.id = id
        
        # Cantidad de unidades del producto
        self.cantidad = cantidad
        
        # Precio de cada unidad del producto
        self.precio_unitario = precio_unitario
