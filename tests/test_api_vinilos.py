import time
import pytest

# ============================================
# TESTS PARA LA API DE VINILOS
# Cada test crea sus datos, los prueba y los limpia
# ============================================


def test_crear_y_eliminar_vinilo(client):
    """
    Test completo: Crear un vinilo, verificar que existe, y eliminarlo.
    """
    timestamp = int(time.time())
    
    # 1. CREAR - Preparar datos del nuevo vinilo
    nuevo_vinilo = {
        "nombre": f"Vinilo Test {timestamp}",
        "artista": "Artista Test",
        "anio": 2024,
        "precio": 25000.50,
        "cantidad": 10,
        "usuario_id": 1  # Debe existir este usuario en tu BD
    }
    
    # 2. CREAR - Hacer POST
    response_post = client.post('/api/vinilos/', json=nuevo_vinilo)
    assert response_post.status_code == 201
    data = response_post.json
    assert 'ok' in data and data['ok'] == True
    assert 'vinilo_id' in data
    
    vinilo_id = data['vinilo_id']
    
    # 3. VERIFICAR - Comprobar que se creó correctamente
    response_get = client.get(f'/api/vinilos/{vinilo_id}')
    assert response_get.status_code == 200
    vinilo_creado = response_get.json
    assert vinilo_creado['nombre'] == nuevo_vinilo['nombre']
    assert vinilo_creado['artista'] == nuevo_vinilo['artista']
    assert vinilo_creado['precio'] == nuevo_vinilo['precio']
    
    # 4. LIMPIAR - Eliminar el vinilo creado
    response_delete = client.delete(f'/api/vinilos/{vinilo_id}')
    assert response_delete.status_code == 200
    
    # 5. VERIFICAR LIMPIEZA - Confirmar que se eliminó
    response_final = client.get(f'/api/vinilos/{vinilo_id}')
    assert response_final.status_code == 404


def test_listar_vinilos(client):
    """
    Test: Crear varios vinilos, listarlos, y eliminarlos.
    """
    timestamp = int(time.time())
    vinilos_creados = []
    
    # 1. CREAR - Crear 3 vinilos de prueba
    for i in range(3):
        vinilo = {
            "nombre": f"Vinilo List Test {timestamp}_{i}",
            "artista": f"Artista {i}",
            "anio": 2020 + i,
            "precio": 20000 + (i * 1000),
            "cantidad": 5 + i,
            "usuario_id": 1
        }
        response = client.post('/api/vinilos/', json=vinilo)
        assert response.status_code == 201
        vinilos_creados.append(response.json['vinilo_id'])
    
    # 2. VERIFICAR - Listar y verificar que existen
    response_list = client.get('/api/vinilos/')
    assert response_list.status_code == 200
    lista = response_list.json
    assert isinstance(lista, list)
    
    # Verificar que nuestros vinilos están en la lista
    ids_en_lista = [v['vinilo_id'] for v in lista]
    for vinilo_id in vinilos_creados:
        assert vinilo_id in ids_en_lista
    
    # 3. LIMPIAR - Eliminar todos los vinilos creados
    for vinilo_id in vinilos_creados:
        response_delete = client.delete(f'/api/vinilos/{vinilo_id}')
        assert response_delete.status_code == 200


def test_obtener_vinilo_no_existente(client):
    """
    Test: Intentar obtener un vinilo que no existe.
    No necesita limpieza porque no crea nada.
    """
    vinilo_id_inexistente = 999999999
    
    response = client.get(f'/api/vinilos/{vinilo_id_inexistente}')
    
    assert response.status_code == 404
    data = response.json
    assert 'error' in data
    assert "Vinilo no encontrado" in data['error']


def test_crear_vinilo_sin_campos_obligatorios(client):
    """
    Test: Intentar crear un vinilo sin todos los campos.
    No necesita limpieza porque no se crea nada.
    """
    vinilo_incompleto = {
        "nombre": "Vinilo Incompleto",
        "artista": "Artista"
        # Faltan: anio, precio, cantidad, usuario_id
    }
    
    response = client.post('/api/vinilos/', json=vinilo_incompleto)
    
    assert response.status_code == 400
    data = response.json
    assert 'error' in data
    assert "Faltan campos obligatorios" in data['error']


def test_actualizar_vinilo(client):
    """
    Test completo: Crear vinilo, actualizarlo, verificar cambios, eliminarlo.
    """
    timestamp = int(time.time())
    
    # 1. CREAR - Crear vinilo inicial
    vinilo_original = {
        "nombre": f"Original {timestamp}",
        "artista": "Artista Original",
        "anio": 2020,
        "precio": 20000,
        "cantidad": 3,
        "usuario_id": 1
    }
    
    response_post = client.post('/api/vinilos/', json=vinilo_original)
    assert response_post.status_code == 201
    vinilo_id = response_post.json['vinilo_id']
    
    # 2. ACTUALIZAR - Modificar el vinilo
    vinilo_actualizado = {
        "nombre": f"Actualizado {timestamp}",
        "artista": "Artista Nuevo",
        "anio": 2024,
        "precio": 35000,
        "cantidad": 7
    }
    
    response_put = client.put(f'/api/vinilos/{vinilo_id}', json=vinilo_actualizado)
    assert response_put.status_code == 200
    data = response_put.json
    assert 'ok' in data and data['ok'] == True
    
    # 3. VERIFICAR - Comprobar que se actualizó
    response_get = client.get(f'/api/vinilos/{vinilo_id}')
    assert response_get.status_code == 200
    vinilo = response_get.json
    assert vinilo['nombre'] == vinilo_actualizado['nombre']
    assert vinilo['artista'] == vinilo_actualizado['artista']
    assert vinilo['precio'] == vinilo_actualizado['precio']
    assert vinilo['cantidad'] == vinilo_actualizado['cantidad']
    
    # 4. LIMPIAR - Eliminar el vinilo
    response_delete = client.delete(f'/api/vinilos/{vinilo_id}')
    assert response_delete.status_code == 200


def test_actualizar_vinilo_sin_campos(client):
    """
    Test: Intentar actualizar un vinilo sin todos los campos requeridos.
    Crea un vinilo, intenta actualizarlo mal, y lo limpia.
    """
    timestamp = int(time.time())
    
    # 1. CREAR - Crear vinilo para probar
    vinilo = {
        "nombre": f"Test Update {timestamp}",
        "artista": "Artista",
        "anio": 2022,
        "precio": 25000,
        "cantidad": 5,
        "usuario_id": 1
    }
    
    response_post = client.post('/api/vinilos/', json=vinilo)
    vinilo_id = response_post.json['vinilo_id']
    
    # 2. INTENTAR ACTUALIZAR MAL - Con datos incompletos
    datos_incompletos = {
        "nombre": "Solo nombre"
        # Faltan: artista, anio, precio, cantidad
    }
    
    response_put = client.put(f'/api/vinilos/{vinilo_id}', json=datos_incompletos)
    assert response_put.status_code == 400
    data = response_put.json
    assert 'error' in data
    
    # 3. LIMPIAR - Eliminar el vinilo
    client.delete(f'/api/vinilos/{vinilo_id}')


def test_eliminar_vinilo_no_existente(client):
    """
    Test: Intentar eliminar un vinilo que no existe.
    No necesita limpieza porque no crea nada.
    """
    vinilo_id_inexistente = 999999999
    
    response = client.delete(f'/api/vinilos/{vinilo_id_inexistente}')
    
    assert response.status_code == 404
    data = response.json
    assert 'error' in data
    assert "Vinilo no encontrado" in data['error']


def test_ciclo_completo_vinilo(client):
    """
    Test del ciclo completo: CREAR -> OBTENER -> ACTUALIZAR -> LISTAR -> ELIMINAR
    """
    timestamp = int(time.time())
    
    # 1. CREAR
    vinilo_data = {
        "nombre": f"Ciclo Completo {timestamp}",
        "artista": "Artista Completo",
        "anio": 2023,
        "precio": 30000,
        "cantidad": 8,
        "usuario_id": 1
    }
    
    response_create = client.post('/api/vinilos/', json=vinilo_data)
    assert response_create.status_code == 201
    vinilo_id = response_create.json['vinilo_id']
    
    # 2. OBTENER
    response_get = client.get(f'/api/vinilos/{vinilo_id}')
    assert response_get.status_code == 200
    assert response_get.json['nombre'] == vinilo_data['nombre']
    
    # 3. ACTUALIZAR
    vinilo_update = {
        "nombre": f"Actualizado Ciclo {timestamp}",
        "artista": "Nuevo Artista",
        "anio": 2024,
        "precio": 40000,
        "cantidad": 12
    }
    response_update = client.put(f'/api/vinilos/{vinilo_id}', json=vinilo_update)
    assert response_update.status_code == 200
    
    # 4. VERIFICAR ACTUALIZACIÓN
    response_get2 = client.get(f'/api/vinilos/{vinilo_id}')
    assert response_get2.json['nombre'] == vinilo_update['nombre']
    assert response_get2.json['precio'] == vinilo_update['precio']
    
    # 5. LISTAR (verificar que está en la lista)
    response_list = client.get('/api/vinilos/')
    ids_en_lista = [v['vinilo_id'] for v in response_list.json]
    assert vinilo_id in ids_en_lista
    
    # 6. ELIMINAR
    response_delete = client.delete(f'/api/vinilos/{vinilo_id}')
    assert response_delete.status_code == 200
    
    # 7. VERIFICAR ELIMINACIÓN
    response_get3 = client.get(f'/api/vinilos/{vinilo_id}')
    assert response_get3.status_code == 404