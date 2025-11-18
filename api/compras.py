# api/compras.py

from flask import Blueprint, request, jsonify
from Managers.compraManager import CompraManager
from DAO.compraDAO import CompraDAO

bp = Blueprint("compras_api", __name__, url_prefix="/api/compras")
mgr = CompraManager()

def to_dict(c):
    return {
        "compra_id": c["compra_id"],
        "comprador_id": c["comprador_id"],
        "vendedor_id": c["vendedor_id"],
        "vinilo_id": c["vinilo_id"],
        "fecha_compra": c["fecha_compra"],
        "vendedor_acepta": bool(c["vendedor_acepta"]),
        "pago_enviado": bool(c["pago_enviado"]),
        "compra_recibida": bool(c["compra_recibida"]),
        # Agrega otros campos si los necesitas
    }

@bp.get("")
def listar_compras():
    estado = request.args.get("estado", None)
    comprador_id = request.args.get("comprador_id", None)
    limit = int(request.args.get("limit", 50))
    offset = int(request.args.get("offset", 0))
    compras = CompraDAO.listar(
        estado=estado, 
        comprador_id=comprador_id, 
        limit=limit, 
        offset=offset
    )
    return jsonify({
        "ok": True, 
        "compras": [to_dict(c) for c in compras], 
        "count": len(compras)
    })
