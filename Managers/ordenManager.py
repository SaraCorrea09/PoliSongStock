# ==========================================
# ORDEN MANAGER
# Reglas del negocio para gestionar órdenes
# ==========================================
class OrdenManager:
    def crearOrden(self, comprador_id: int, detalles: list, metodoPago: str) -> int:
        """Crea la orden con sus detalles y retorna el ID."""
        pass

    def confirmarOrden(self, orden_id: int) -> None:
        """Marca la orden como pagada/confirmada."""
        pass

    def rechazarOrden(self, orden_id: int, motivo: str | None = None) -> None:
        """Rechaza la orden y registra el motivo."""
        pass