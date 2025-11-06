# ==========================================
# VINILO DAO
# Acceso a datos de vinilos
# ==========================================
from Datos.Vinilo import Vinilo

class ViniloDAO:
    def __init__(self, conexion):
        self.conexion = conexion
        
    def agregarVinilo(self, vinilo) -> None:
        """Crea una nuevo vinilo."""
        pass

    def eliminarVinilo(self, vinilo_id: int) -> None:
        """Elimina un vinilo por ID."""
        pass

    def editarVinilo(self, vinilo) -> None:
        """Actualiza datos de un vinilo existente."""
        pass

    def buscarVinilo(self, vinilo_id: int):
        """Obtiene una vinilo por ID (o None)."""
        pass
    
    def filtrar_vinilos(self, genero=None, precio_min=None, precio_max=None, calidad=None, disponible=None):
        cursor = self.conexion.cursor()
        query = "SELECT vinilo_id, nombre, artista, año, precio, cantidad, vendedor_id FROM Vinilos WHERE 1=1"
        params = []

        if genero:
            query += " AND vinilo_id IN (SELECT vinilo_id FROM ViniloCancion vc JOIN Canciones c ON vc.cancion_id = c.cancion_id WHERE c.genero LIKE ?)"
            params.append(f"%{genero}%")
        if precio_min is not None:
            query += " AND precio >= ?"
            params.append(precio_min)
        if precio_max is not None:
            query += " AND precio <= ?"
            params.append(precio_max)
        if disponible is not None:
            query += " AND cantidad > 0" if disponible else " AND cantidad = 0"

        cursor.execute(query, params)
        rows = cursor.fetchall()

        vinilos = []
        for r in rows:
            vinilos.append(Vinilo(*r))
        return vinilos
