# ==========================================
# CARRITO DAO
# Acceso a datos del carrito (CRUD de ítems)
# ==========================================
class CarritoDAO:
    def agregarItem(self, carrito_id: int, producto_id: int, cantidad: int) -> None:
        """Inserta un ítem (producto + cantidad) en el carrito dado."""
        pass

    def eliminarItem(self, carrito_id: int, item_id: int) -> None:
        """Borra un ítem específico del carrito."""
        pass

    def editarItem(self, carrito_id: int, item_id: int, cantidad: int) -> None:
        """Actualiza la cantidad de un ítem del carrito."""
        pass

    def buscarItem(self, carrito_id: int, item_id: int):
        """Retorna el ítem buscado (o None si no existe)."""
        pass

