# ==========================================
# CATALOGO MANAGER
# Reglas del negocio para publicar productos
# ==========================================
from DAO.viniloDAO import ViniloDAO
from database import get_connection

class CatalogoManager:
    def publicarVinilo(self, vinilo) -> int:
        """Publica un nuevo Vinilo y retorna su ID."""
        pass

    def publicarCancion(self, disco) -> int:
        """Publica un nuevo DiscoMp3 y retorna su ID."""
        pass
    def filtrar_vinilos(self, genero=None, precio_min=None, precio_max=None, calidad=None, disponible=None):
        conn = get_connection()
        dao = ViniloDAO(conn)
        vinilos = dao.filtrar_vinilos(genero, precio_min, precio_max, calidad, disponible)
        conn.close()
        return vinilos