from flask import Flask
from authentication import auth_blueprint
from productos import productos_blueprint
from ventas import ventas_blueprint

app = Flask(__name__)

app.register_blueprint(auth_blueprint, url_prefix='/api/auth')
app.register_blueprint(productos_blueprint, url_prefix='/api/productos')
app.register_blueprint(ventas_blueprint, url_prefix='/api/ventas')


if __name__ == '__main__':
    print("Rutas registradas:")
    for rule in app.url_map.iter_rules():
        print(f"{rule} -> {rule.endpoint}")
    app.run(debug=True)
