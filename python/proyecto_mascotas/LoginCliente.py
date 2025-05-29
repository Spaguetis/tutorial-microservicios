import bcrypt
import mysql.connector
from mainshop import menu_usuario  # 👈 Importamos la función desde main.py

def conectar_bd():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Mayito16",
        database="tienda"
    )

def login():
    print("=== Iniciar Sesión ===")
    usuario = input("Usuario: ").strip()
    contraseña = input("Contraseña: ").strip()

    if not usuario or not contraseña:
        print("❌ Usuario y contraseña son obligatorios.")
        return

    conexion = conectar_bd()
    cursor = conexion.cursor()

    # Buscar usuario en la tabla
    cursor.execute("""
        SELECT id, nombre, contraseña, rol
        FROM usuarios_admin
        WHERE usuario = %s
    """, (usuario,))
    resultado = cursor.fetchone()

    if resultado:
        user_id, nombre, hashed_password, rol = resultado

        if bcrypt.checkpw(contraseña.encode('utf-8'), hashed_password.encode('utf-8')):
            print(f"\n✅ Bienvenido {nombre} ({rol})")
            menu_usuario(rol)  # 👈 Usamos la función dinámica desde main.py
        else:
            print("❌ Contraseña incorrecta.")
    else:
        print("❌ Usuario no encontrado.")

    cursor.close()
    conexion.close()

if __name__ == "__main__":
    login()
