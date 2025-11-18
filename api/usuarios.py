# api/usuarios.py
from flask import Blueprint, request, jsonify
from Managers.usuarioManager import UsuarioManager
from DAO.usuarioDAO import UsuarioDAO

bp = Blueprint("usuarios_api", __name__, url_prefix="/api/usuarios")
mgr = UsuarioManager()

def to_dict(u):
    return {
        "usuario_id": u.usuario_id,
        "nombre": u.nombre,
        "correo": u.correo,
        "telefono": u.telefono,
        "rol": u.rol
    }

@bp.post("")
def crear_usuario():
    data = request.get_json() or {}
    try:
        new_id = mgr.registrar_usuario(data)
        u = mgr.buscar_usuario(new_id)
        return jsonify({"ok": True, "usuario": to_dict(u)}), 201
    except ValueError as e:
        return jsonify({"ok": False, "error": str(e)}), 400

@bp.get("")
def listar_usuarios():
    limit = int(request.args.get("limit", 50))
    offset = int(request.args.get("offset", 0))
    usuarios = UsuarioDAO.listar(limit, offset)
    return jsonify({"ok": True, "usuarios": [to_dict(u) for u in usuarios]})

@bp.get("/<int:usuario_id>")
def obtener_usuario(usuario_id):
    u = mgr.buscar_usuario(usuario_id)
    if not u:
        return jsonify({"ok": False, "error": "No encontrado"}), 404
    return jsonify({"ok": True, "usuario": to_dict(u)})

@bp.put("/<int:usuario_id>")
def editar_usuario(usuario_id):
    data = request.get_json() or {}
    try:
        ok = mgr.editar_perfil(usuario_id, data)
        if not ok:
            return jsonify({"ok": False, "error": "No se actualizó"}), 400
        u = mgr.buscar_usuario(usuario_id)
        return jsonify({"ok": True, "usuario": to_dict(u)})
    except ValueError as e:
        return jsonify({"ok": False, "error": str(e)}), 400

@bp.delete("/<int:usuario_id>")
def borrar_usuario(usuario_id):
    ok = mgr.eliminar_usuario(usuario_id)
    if not ok:
        return jsonify({"ok": False, "error": "No encontrado"}), 404
    return jsonify({"ok": True})

@bp.post("/login")
def login():
    data = request.get_json() or {}

    if not data.get("correo") or not data.get("contrasena"):
        return jsonify({"ok": False, "error": "correo y contrasena requeridos"}), 400

    usuario = mgr.autentificar_usuario(data["correo"], data["contrasena"])

    if usuario:
        return jsonify({
            "ok": True,
            "usuario": {
                "usuario_id": usuario.usuario_id,
                "nombre": usuario.nombre,
                "correo": usuario.correo,
                "rol": usuario.rol
            }
        })
    else:
        return jsonify({"ok": False, "error": "credenciales inválidas"}), 401
