from dataclasses import dataclass
from typing import Optional

@dataclass
class Usuario:
    usuario_id: Optional[int]
    nombre: str
    correo: str
    contrasena: str
    telefono: Optional[str]
    rol: str
