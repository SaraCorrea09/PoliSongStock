import time # <-- ¡Necesitamos importar esto!

def test_get_usuario_especifico(client):
    """
    Prueba que la ruta GET /api/usuarios/1 funciona
    y devuelve los datos correctos.
    """
    response = client.get('/api/usuarios/1')

    # 1. Verificar el código de estado
    assert response.status_code == 200
    
    # 2. Verificar la estructura y datos
    data = response.json
    assert 'ok' in data and data['ok'] == True
    assert 'usuario' in data
    
    usuario = data['usuario']
    assert usuario['usuario_id'] == 1
    assert 'correo' in usuario
    assert 'nombre' in usuario


def test_crear_usuario_exitosamente(client):
    """
    Prueba que se puede crear un nuevo usuario
    usando POST /api/usuarios.
    """
    
    # --- ¡LA CORRECCIÓN ESTÁ AQUÍ! ---
    # Generamos un 'timestamp' (ej. 1678886400) para 
    # crear un correo y teléfono únicos en CADA ejecución.
    timestamp = int(time.time())
    correo_unico = f"usuario_{timestamp}@example.com"
    telefono_unico = f"300{timestamp}"[-10:] # Tomamos los últimos 10 dígitos

    # 1. Preparar (Arrange): Definimos el JSON con datos únicos
    nuevo_usuario_data = {
        "nombre": "Usuario de Prueba",
        "correo": correo_unico,
        "contrasena": "contrasena_segura_123",
        "telefono": telefono_unico,
        "rol": "seller"
    }

    # 2. Actuar (Act): Hacemos la petición POST
    response = client.post('/api/usuarios', json=nuevo_usuario_data)

    # (Puedes borrar los 'print' de depuración ahora si quieres)
    # try:
    #     print(f"Respuesta de la API: {response.json}")
    # except Exception:
    #     print(f"Respuesta de la API (no es JSON): {response.data}")

    # 3. Verificar (Assert): Comprobamos la respuesta del POST
    assert response.status_code == 201, f"Código de estado inesperado: {response.status_code}"

    data = response.json
    assert 'ok' in data and data['ok'] == True
    assert 'usuario' in data

    # Verificamos que los datos en la respuesta son correctos
    usuario_creado = data['usuario']
    assert usuario_creado['nombre'] == "Usuario de Prueba"
    assert usuario_creado['correo'] == correo_unico # Verificamos el correo único
    assert 'usuario_id' in usuario_creado
    
    # --- Verificación extra (CRUCIAL) ---
    nuevo_id = usuario_creado['usuario_id']
    response_get = client.get(f'/api/usuarios/{nuevo_id}')
    
    assert response_get.status_code == 200
    
    data_get = response_get.json
    assert data_get['usuario']['nombre'] == "Usuario de Prueba"
    assert data_get['usuario']['correo'] == correo_unico