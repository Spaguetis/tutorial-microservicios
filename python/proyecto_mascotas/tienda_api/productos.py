from flask import Blueprint, jsonify
import mysql.connector

productos_blueprint = Blueprint('productos', __name__)

def conectar_bd():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Mayito16",
        database="tienda"
    )

@productos_blueprint.route('/', methods=['GET'])
def ver_productos():
    conexion = conectar_bd()
    cursor = conexion.cursor()
    cursor.execute("SELECT id, nombre, precio FROM productos")
    productos = cursor.fetchall()
    cursor.close()
    conexion.close()

    lista = [{'id': p[0], 'nombre': p[1], 'precio': float(p[2])} for p in productos]
    return jsonify(lista)