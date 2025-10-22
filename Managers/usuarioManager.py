# ==========================================
# USUARIO MANAGER
# Reglas del negocio para la gestión de usuarios
# ==========================================

class UsuarioManager:
    def registrarUsuario(self, usuario) -> int:
        """Registra un nuevo usuario en el sistema y retorna su ID."""
        pass

    def autenticarUsuario(self, correo: str, contrasena: str) -> bool:
        """Verifica las credenciales del usuario para iniciar sesión."""
        pass

    def editarPerfil(self, usuario_id: int, nuevos_datos) -> None:
        """Permite al usuario modificar su información personal o de cuenta."""
        pass
