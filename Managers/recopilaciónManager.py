# ==========================================
# RECOPILACION MANAGER
# Reglas del negocio para recopilar canciones
# ==========================================
class RecopilacionManager:
    def crearRecopilacion(self, recop) -> int:
        """Crea una recopilación y retorna su ID."""
        pass

    def agregarCancion(self, recop_id: int, cancion) -> None:
        """Asocia una canción a la recopilación."""
        pass

    def eliminarCancion(self, recop_id: int, cancion_id: int) -> None:
        """Quita una canción de la recopilación."""
        pass
