# ---------------------------------------------------------
# Clase: UsuarioDAO
# Descripción: Encargada de manejar las operaciones de 
# acceso a datos relacionadas con los usuarios del sistema.
# Permite registrar, modificar, eliminar y consultar usuarios.
# ---------------------------------------------------------

# usuario_dao.py
from typing import Optional, List
from database import get_connection
from core.models import Usuario

class UsuarioDAO:
    @staticmethod
    def agregar_usuario(u: Usuario) -> int:
        conn = get_connection()
        try:
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO usuarios (nombre, correo, contrasena, telefono, rol)
                VALUES (?, ?, ?, ?, ?);
            """, (u.nombre, u.correo, u.contrasena, u.telefono, u.rol))
            conn.commit()
            return cur.lastrowid
        finally:
            conn.close()

    @staticmethod
    def eliminar_usuario(usuario_id: int) -> bool:
        conn = get_connection()
        try:
            cur = conn.cursor()
            
            # Verificar que el usuario existe primero
            cur.execute("SELECT usuario_id FROM usuarios WHERE usuario_id = ?;", (usuario_id,))
            if not cur.fetchone():
                return False  # Usuario no existe
            
            # Desactivar temporalmente las foreign keys para este DELETE
            cur.execute("PRAGMA foreign_keys = OFF;")
            
            # Eliminar las canciones donde es vendedor
            cur.execute("DELETE FROM canciones_nueva WHERE usuario_vendedor_id = ?;", (usuario_id,))
            
            # Poner NULL donde es comprador
            cur.execute("UPDATE canciones_nueva SET usuario_comprador_id = NULL WHERE usuario_comprador_id = ?;", (usuario_id,))
            
            # Eliminar el usuario
            cur.execute("DELETE FROM usuarios WHERE usuario_id = ?;", (usuario_id,))
            
            # Reactivar foreign keys
            cur.execute("PRAGMA foreign_keys = ON;")
            
            conn.commit()
            return True
        except Exception as e:
            conn.rollback()
            print(f"Error al eliminar usuario: {e}")
            return False
        finally:
            conn.close()

    @staticmethod
    def editar_usuario(u: Usuario) -> bool:
        conn = get_connection()
        try:
            cur = conn.cursor()
            cur.execute("""
                UPDATE usuarios
                   SET nombre = ?, correo = ?, contrasena = ?, telefono = ?, rol = ?
                 WHERE usuario_id = ?;
            """, (u.nombre, u.correo, u.contrasena, u.telefono, u.rol, u.usuario_id))
            conn.commit()
            return cur.rowcount > 0
        finally:
            conn.close()

    @staticmethod
    def buscar_por_id(usuario_id: int) -> Optional[Usuario]:
        conn = get_connection()
        try:
            cur = conn.cursor()
            cur.execute("""
                SELECT usuario_id, nombre, correo, contrasena, telefono, rol
                  FROM usuarios WHERE usuario_id = ?;
            """, (usuario_id,))
            row = cur.fetchone()
            if not row:
                return None
            return Usuario(*row)
        finally:
            conn.close()

    @staticmethod
    def buscar_por_correo(correo: str) -> Optional[Usuario]:
        conn = get_connection()
        try:
            cur = conn.cursor()
            cur.execute("""
                SELECT usuario_id, nombre, correo, contrasena, telefono, rol
                  FROM usuarios WHERE correo = ?;
            """, (correo,))
            row = cur.fetchone()
            if not row:
                return None
            return Usuario(*row)
        finally:
            conn.close()

    @staticmethod
    def listar(limit: int = 50, offset: int = 0) -> List[Usuario]:
        conn = get_connection()
        try:
            cur = conn.cursor()
            cur.execute("""
                SELECT usuario_id, nombre, correo, contrasena, telefono, rol
                  FROM usuarios
                 ORDER BY usuario_id
                 LIMIT ? OFFSET ?;
            """, (limit, offset))
            rows = cur.fetchall()
            return [Usuario(*r) for r in rows]
        finally:
            conn.close()
