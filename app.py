from flask import Flask
from api import register_apis

def create_app():
    app = Flask(__name__)
    register_apis(app)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)  # http://127.0.0.1:5000
