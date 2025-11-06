# ==========================
# ADMINISTRADOR
# Hereda de Usuario, maneja la configuración general
from .Usuario import Usuario
# ==========================
class Administrador(Usuario):
    def gestionarUsuarios(self):
        pass  # Administra los usuarios del sistema
    
    def configurarCatalogo(self):
        pass  # Configura el catálogo general de productos
    
    def definirParametros(self):
        pass  # Define reglas o parámetros globales del sistema