from flask import Flask, request, jsonify
from flask_cors import CORS  # para permitir peticiones desde React
from Managers.catalogoManager import filtrar_vinilos

app = Flask(__name__)
CORS(app)  # permite conexión desde React

@app.route('/api/vinilos', methods=['GET'])
def obtener_vinilos():
    genero = request.args.get('genero')
    precio_min = request.args.get('precio_min', type=float)
    precio_max = request.args.get('precio_max', type=float)
    calidad = request.args.get('calidad')
    disponible = request.args.get('disponible')
    if disponible is not None:
        disponible = disponible.lower() == 'true'

    vinilos = filtrar_vinilos(genero, precio_min, precio_max, calidad, disponible)

    # Convertimos los objetos Vinilo a JSON
    data = [{
        'id': v.id,
        'nombre': v.nombre,
        'artista': v.artista,
        'genero': v.genero,
        'anio': v.anio,
        'precio': v.precio,
        'calidad': v.calidad,
        'cantidad': v.cantidad
    } for v in vinilos]

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
