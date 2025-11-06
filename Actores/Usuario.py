# ==========================
# USUARIO BASE
# ==========================
class Usuario:
    def __init__(self, id: int, nombre: str, correo: str, contraseña: str, telefono: str, rol: str):
        # Constructor base con los datos generales de un usuario
        self.id = id
        self.nombre = nombre
        self.correo = correo
        self.contraseña = contraseña
        self.telefono = telefono
        self.rol = rol

    # Autenticación del usuario (inicio de sesión)
    def autenticar(self):
        pass

    # Permite gestionar o modificar datos del perfil
    def gestionarCuenta(self):
        pass