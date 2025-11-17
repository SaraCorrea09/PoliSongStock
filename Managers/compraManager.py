# compra_manager.py
from typing import Optional, Dict, Any
from DAO.compraDAO import CompraDAO


class CompraManager:

    def buscar_compra(self, compra_id: int) -> Optional[Dict]:
        return CompraDAO.buscar_por_id(compra_id)

    def vendedor_acepta(self, compra_id: int, valor: bool) -> bool:
        compra = self.buscar_compra(compra_id)
        if not compra:
            raise ValueError("Compra no encontrada")
        if compra["vendedor_acepta"] and compra["pago_enviado"] and compra["compra_recibida"]:
            # No modificar compra completada
            return False
        estados_actualizar = {"vendedor_acepta": valor}
        return CompraDAO.actualizar(estados_actualizar, compra_id)

    def pago_enviado(self, compra_id: int, valor: bool) -> bool:
        compra = self.buscar_compra(compra_id)
        if not compra:
            raise ValueError("Compra no encontrada")
        if not compra["vendedor_acepta"]:
            raise ValueError("El vendedor debe aceptar la compra antes de enviar el pago")
        if compra["pago_enviado"] and compra["compra_recibida"]:
            return False
        estados_actualizar = {"pago_enviado": valor}
        return CompraDAO.actualizar(estados_actualizar, compra_id)

    def compra_recibida(self, compra_id: int, valor: bool) -> bool:
        compra = self.buscar_compra(compra_id)
        if not compra:
            raise ValueError("Compra no encontrada")
        if not compra["vendedor_acepta"] or not compra["pago_enviado"]:
            raise ValueError("El vendedor debe aceptar y el pago debe estar enviado")
        estados_actualizar = {"compra_recibida": valor}
        return CompraDAO.actualizar(estados_actualizar, compra_id)

    def actualizar_estados(self, compra_id: int, data: Dict[str, Any]) -> bool:
        compra = self.buscar_compra(compra_id)
        if not compra:
            raise ValueError("Compra no encontrada")

        if "vendedor_acepta" in data:
            if compra["vendedor_acepta"] and compra["pago_enviado"] and compra["compra_recibida"]:
                return False
            compra["vendedor_acepta"] = bool(data["vendedor_acepta"])

        if "pago_enviado" in data:
            if not compra["vendedor_acepta"]:
                raise ValueError("El vendedor debe aceptar la compra antes de enviar el pago")
            compra["pago_enviado"] = bool(data["pago_enviado"])

        if "compra_recibida" in data:
            if not compra["vendedor_acepta"] or not compra["pago_enviado"]:
                raise ValueError("El vendedor debe aceptar y el pago debe estar enviado")
            compra["compra_recibida"] = bool(data["compra_recibida"])

        return CompraDAO.actualizar(data, compra_id)
