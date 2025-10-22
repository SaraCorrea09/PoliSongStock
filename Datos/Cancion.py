# ---------------------------------------------------------
# Clase: Cancion
# Descripción: Representa una canción disponible en el sistema,
# tanto para venta individual como asociada a discos o recopilaciones.
# ---------------------------------------------------------

class Cancion:
    def __init__(self, id: int, nombre: str, artista: str, genero: str, duracion: float, tamano_mb: float, calidad_kbps: int, precio: float):
        # Identificador único de la canción
        self.id = id
        
        # Nombre de la canción
        self.nombre = nombre
        
        # Artista o banda que interpreta la canción
        self.artista = artista
        
        # Género musical (Ej: Rock, Pop, Clásica)
        self.genero = genero
        
        # Duración de la canción (en minutos o segundos)
        self.duracion = duracion
        
        # Tamaño del archivo en megabytes
        self.tamano_mb = tamano_mb
        
        # Calidad del audio en kilobytes por segundo (Kbps)
        self.calidad_kbps = calidad_kbps
        
        # Precio de venta individual de la canción
        self.precio = precio
