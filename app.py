from flask import Flask, request, jsonify
from flask_cors import CORS
from Managers.catalogoManager import CatalogoManager

app = Flask(__name__)
CORS(app)

@app.route('/api/vinilos', methods=['GET'])
def obtener_vinilos():
    genero = request.args.get('genero')
    precio_min = request.args.get('precio_min', type=float)
    precio_max = request.args.get('precio_max', type=float)
    calidad = request.args.get('calidad')
    disponible = request.args.get('disponible')
    if disponible is not None:
        disponible = disponible.lower() == 'true'

    manager = CatalogoManager()
    vinilos = manager.filtrar_vinilos(genero, precio_min, precio_max, calidad, disponible)

    data = [{
        'vinilo_id': v.vinilo_id,
        'nombre': v.nombre,
        'artista': v.artista,
        'anio': v.año,
        'precio': v.precio,
        'cantidad': v.cantidad,
        'vendedor_id': v.vendedor_id
    } for v in vinilos]

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
