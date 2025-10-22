# ---------------------------------------------------------
# Clase: Orden
# Descripción: Representa una orden de compra dentro del sistema.
# Contiene información sobre el cliente, los productos y el estado.
# ---------------------------------------------------------

class Orden:
    def __init__(self, id: int, fecha: str, estado: str, observaciones: str, metodo_pago: str, total: float):
        # Identificador único de la orden
        self.id = id
        
        # Fecha en la que se creó la orden
        self.fecha = fecha
        
        # Estado actual de la orden (Ej: "Pendiente", "Confirmada", "Enviada", "Recibida")
        self.estado = estado
        
        # Comentarios u observaciones relacionadas con la orden
        self.observaciones = observaciones
        
        # Método de pago utilizado (Ej: "Tarjeta", "PSE", "Efectivo")
        self.metodo_pago = metodo_pago
        
        # Valor total de la orden
        self.total = total
