# ==========================================
# CONTROLADOR UI (Flask)
# Puente entre HTTP y la capa de negocio
# ==========================================
class ControladorUI:
    def mostrarCatalogo(self):
        """Entrega al usuario la lista de productos (HTML/JSON)."""
        pass

    def mostrarCarrito(self, carrito_id: int):
        """Muestra el contenido del carrito del usuario."""
        pass

    def mostrarOrden(self, orden_id: int):
        """Muestra los detalles de una orden específica."""
        pass

    def mostrarRecopilaciones(self, comprador_id: int):
        """Lista las recopilaciones del comprador."""
        pass

    def mostrarError(self, mensaje: str):
        """Responde con un error amigable (vista o JSON)."""
        pass

