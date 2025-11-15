# En: tests/conftest.py
import pytest
from app import create_app  # Importa desde tu archivo app.py

@pytest.fixture
def app():
    # Crea la instancia de la app
    app = create_app()
    
    # Configura la app para el modo "Testing"
    app.config.update({
        "TESTING": True,
    })
    yield app

# ¡No necesitas hacer nada para 'client'!
# pytest-flask lo crea automáticamente
# usando el fixture 'app' que acabas de definir.