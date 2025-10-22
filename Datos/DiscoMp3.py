# ---------------------------------------------------------
# Clase: DiscoMp3
# Descripción: Representa un disco digital en formato MP3 
# disponible en el sistema, con información general y de venta.
# ---------------------------------------------------------

class DiscoMp3:
    def __init__(self, id: int, nombre: str, artista: str, genero: str, anio: int, precio: float):
        # Identificador único del disco MP3
        self.id = id
        
        # Nombre del disco
        self.nombre = nombre
        
        # Artista o grupo musical del disco
        self.artista = artista
        
        # Género musical del disco (Ej: Pop, Rock, Jazz)
        self.genero = genero
        
        # Año de lanzamiento del disco
        self.anio = anio
        
        # Precio de venta del disco MP3
        self.precio = precio
