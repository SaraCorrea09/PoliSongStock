from flask import Flask
from api import register_apis
from flask_cors import CORS   

def create_app():
    app = Flask(__name__)
    
    # ✅ CRÍTICO: Desactivar strict_slashes
    app.url_map.strict_slashes = False
    
    # ✅ CORS simple y permisivo
    CORS(app)
    
    register_apis(app)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000, host='0.0.0.0')