from flask import Blueprint, request, jsonify
from Managers.compraManager import CompraManager
from DAO.compraDAO import CompraDAO

bp = Blueprint("compras_api", __name__, url_prefix="/api/compras")
mgr = CompraManager()

def to_dict(c):
    return {
        "compra_id": c.compra_id,
        "usuario_id": c.usuario_id,
        "cancion_id": c.cancion_id,
        "fecha_compra": c.fecha_compra,
        "vendedor_acepta": bool(c.vendedor_acepta),
        "pago_enviado": bool(c.pago_enviado),
        "compra_recibida": bool(c.compra_recibida),
        #"precio_total": float(c.precio_total)
    }

@bp.get("/<int:compra_id>")
def obtener_compra(compra_id):
    compra = mgr.buscar_compra(compra_id)
    if not compra:
        return jsonify({"ok": False, "error": "Compra no encontrada"}), 404
    return jsonify({"ok": True, "compra": to_dict(compra)})

@bp.patch("/<int:compra_id>/vendedor-acepta")
def actualizar_vendedor_acepta(compra_id):
    data = request.get_json() or {}
    try:
        ok = mgr.actualizar_estado(compra_id, vendedor_acepta=data.get("vendedor_acepta"))
        compra = mgr.buscar_compra(compra_id)
        return jsonify({"ok": True, "mensaje": "Estado 'vendedor_acepta' actualizado correctamente", "compra": to_dict(compra)})
    except ValueError as e:
        return jsonify({"ok": False, "error": str(e)}), 400

@bp.patch("/<int:compra_id>/pago-enviado")
def actualizar_pago_enviado(compra_id):
    data = request.get_json() or {}
    try:
        ok = mgr.actualizar_estado(compra_id, pago_enviado=data.get("pago_enviado"))
        compra = mgr.buscar_compra(compra_id)
        return jsonify({"ok": True, "mensaje": "Estado 'pago_enviado' actualizado correctamente", "compra": to_dict(compra)})
    except ValueError as e:
        return jsonify({"ok": False, "error": str(e)}), 400

@bp.patch("/<int:compra_id>/compra-recibida")
def actualizar_compra_recibida(compra_id):
    data = request.get_json() or {}
    try:
        ok = mgr.actualizar_estado(compra_id, compra_recibida=data.get("compra_recibida"))
        compra = mgr.buscar_compra(compra_id)
        return jsonify({"ok": True, "mensaje": "Estado 'compra_recibida' actualizado correctamente", "compra": to_dict(compra)})
    except ValueError as e:
        return jsonify({"ok": False, "error": str(e)}), 400

@bp.patch("/<int:compra_id>/estado")
def actualizar_multiples_estados(compra_id):
    data = request.get_json() or {}
    try:
        ok = mgr.actualizar_estado(compra_id, **data)
        compra = mgr.buscar_compra(compra_id)
        return jsonify({"ok": True, "mensaje": "Estados actualizados correctamente", "compra": to_dict(compra)})
    except ValueError as e:
        return jsonify({"ok": False, "error": str(e)}), 400

@bp.get("/<int:compra_id>/estado")
def obtener_estado(compra_id):
    compra = mgr.buscar_compra(compra_id)
    if not compra:
        return jsonify({"ok": False, "error": "Compra no encontrada"}), 404
    estados = {
        "vendedor_acepta": bool(compra.vendedor_acepta),
        "pago_enviado": bool(compra.pago_enviado),
        "compra_recibida": bool(compra.compra_recibida)
    }
    completada = compra.vendedor_acepta and compra.pago_enviado and compra.compra_recibida
    return jsonify({"ok": True, "compra_id": compra_id, "estados": estados, "completada": completada})

@bp.get("")
def listar_compras():
    estado = request.args.get("estado", None)
    usuario_id = request.args.get("usuario_id", None)
    limit = int(request.args.get("limit", 50))
    offset = int(request.args.get("offset", 0))
    compras = CompraDAO.listar(estado=estado, usuario_id=usuario_id, limit=limit, offset=offset)
    return jsonify({"ok": True, "compras": [to_dict(c) for c in compras], "count": len(compras)})

