from flask import Blueprint, request, jsonify
import mysql.connector
import bcrypt

auth_blueprint = Blueprint('auth', __name__)

def conectar_bd():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Mayito16",
        database="tienda"
    )

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'usuario' not in data or 'contraseña' not in data:
        return jsonify({"error": "Usuario y contraseña requeridos"}), 400

    usuario = data['usuario']
    contraseña = data['contraseña']

    conexion = conectar_bd()
    cursor = conexion.cursor()
    cursor.execute("SELECT id, nombre, contraseña, rol FROM usuarios_admin WHERE usuario = %s", (usuario,))
    resultado = cursor.fetchone()
    cursor.close()
    conexion.close()

    if resultado:
        user_id, nombre, hashed_password, rol = resultado
        if bcrypt.checkpw(contraseña.encode('utf-8'), hashed_password.encode('utf-8')):
            return jsonify({"mensaje": f"Bienvenido {nombre}", "rol": rol}), 200
        else:
            return jsonify({"error": "Contraseña incorrecta"}), 401
    else:
        return jsonify({"error": "Usuario no encontrado"}), 404
