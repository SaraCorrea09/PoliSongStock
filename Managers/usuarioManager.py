# ==========================================
# USUARIO MANAGER
# Reglas del negocio para la gestión de usuarios
# ==========================================

# usuario_manager.py
from typing import Optional, Dict, Any
from core.models import Usuario
from DAO.usuarioDAO import UsuarioDAO

class UsuarioManager:
    def registrar_usuario(self, data: Dict[str, Any]) -> int:
        requeridos = ["nombre", "correo", "contrasena", "rol"]
        faltantes = [k for k in requeridos if not data.get(k)]
        if faltantes:
            raise ValueError(f"Faltan campos: {', '.join(faltantes)}")

        if UsuarioDAO.buscar_por_correo(data["correo"]):
            raise ValueError("El correo ya está registrado")

        u = Usuario(
            usuario_id=None,
            nombre=data["nombre"],
            correo=data["correo"],
            contrasena=data["contrasena"],
            telefono=data.get("telefono"),
            rol=data.get("rol", "buyer"),
        )
        return UsuarioDAO.agregar_usuario(u)

    def autentificar_usuario(self, correo: str, contrasena: str) -> bool:
        u = UsuarioDAO.buscar_por_correo(correo)
        if not u:
            return False
        return u.contrasena == contrasena

    def editar_perfil(self, usuario_id: int, data: Dict[str, Any]) -> bool:
        u = UsuarioDAO.buscar_por_id(usuario_id)
        if not u:
            raise ValueError("Usuario no encontrado")

        nuevo_correo = data.get("correo", u.correo)
        if nuevo_correo != u.correo and UsuarioDAO.buscar_por_correo(nuevo_correo):
            raise ValueError("Correo ya está en uso")

        u_edit = Usuario(
            usuario_id=usuario_id,
            nombre=data.get("nombre", u.nombre),
            correo=nuevo_correo,
            contrasena=data.get("contrasena", u.contrasena),
            telefono=data.get("telefono", u.telefono),
            rol=data.get("rol", u.rol),
        )
        return UsuarioDAO.editar_usuario(u_edit)

    def buscar_usuario(self, usuario_id: int) -> Optional[Usuario]:
        return UsuarioDAO.buscar_por_id(usuario_id)

    def eliminar_usuario(self, usuario_id: int) -> bool:
        return UsuarioDAO.eliminar_usuario(usuario_id)
