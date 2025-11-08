def register_apis(app):
    from api.usuarios import bp as usuarios_bp
    app.register_blueprint(usuarios_bp)
