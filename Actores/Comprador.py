# ==========================
# COMPRADOR
# Hereda de Usuario, representa a quien compra productos
# ==========================
from .Usuario import Usuario

class Comprador(Usuario):
    def buscarProducto(self):
        pass  # Permite buscar un producto en el catálogo
    
    def agregarCarrito(self):
        pass  # Agrega un producto al carrito de compras
    
    def realizarPago(self):
        pass  # Ejecuta el proceso de pago de una orden
    
    def confirmarRecepcion(self):
        pass  # Confirma que recibió el producto
    
    def valorarCompra(self):
        pass  # Deja una calificación o comentario del producto
