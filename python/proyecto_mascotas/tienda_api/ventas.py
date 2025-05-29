from flask import Blueprint, request, jsonify
from datetime import date
import mysql.connector

ventas_blueprint = Blueprint('ventas', __name__)

def conectar_bd():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Mayito16",
        database="tienda"
    )

@ventas_blueprint.route('/', methods=['POST'])
def registrar_venta():
    data = request.get_json()
    id_producto = data.get('id_producto')
    cantidad = data.get('cantidad')