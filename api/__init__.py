def register_apis(app):
    from api.usuarios import bp as usuarios_bp
    app.register_blueprint(usuarios_bp)
    
    from api.pasarela_pago_vinilo import  bp as compras_bp
    app.register_blueprint(compras_bp)
    
    from api.pasarela_pago_cancion import bp as compras_canciones_bp
    app.register_blueprint(compras_canciones_bp)
    
    from api.traer_compras_vinilos import bp as traer_compras_bp
    app.register_blueprint(traer_compras_bp)
    
    from api.traer_compras_cancioness import bp as traer_compras_canciones_bp
    app.register_blueprint(traer_compras_canciones_bp)
    
    from api.compras import bp as pasarela_bp
    app.register_blueprint(pasarela_bp)
    
    from api.canciones import bp as canciones_bp
    app.register_blueprint(canciones_bp)
    
    from api.vinilos import bp as vinilos_bp
    app.register_blueprint(vinilos_bp)
