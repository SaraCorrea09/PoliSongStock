# ---------------------------------------------------------
# Clase: OrdenDetalleDAO
# Descripción: Encargada de manejar las operaciones de 
# acceso a datos relacionadas con los detalles de una orden.
# Cada detalle corresponde a un producto incluido en la orden.
# ---------------------------------------------------------

class OrdenDetalleDAO:

    def agregarOrdenDetalle(self, orden_detalle):
        # Inserta un nuevo detalle de orden en la base de datos
        # Incluye la relación con la orden, el producto, la cantidad y el precio unitario
        pass

    def eliminarOrdenDetalle(self, id_detalle):
        # Elimina un detalle de orden según su identificador
        # Este método puede usarse si un producto se elimina del pedido antes de confirmarse
        pass

    def editarOrdenDetalle(self, orden_detalle):
        # Actualiza la información de un detalle de orden existente
        # Por ejemplo, para modificar la cantidad o el precio de un producto
        pass

    def buscarOrdenDetalle(self, id_detalle):
        # Busca y retorna la información de un detalle de orden específico según su ID
        pass
