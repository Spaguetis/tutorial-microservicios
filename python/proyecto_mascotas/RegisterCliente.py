import bcrypt
from datetime import date
import mysql.connector

def conectar_bd():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Mayito16",
        database="tienda"
    )

def registrar_cliente():
    print("\n=== Registro de Nuevo Cliente ===")
    nombre = input("Nombre completo: ").strip()
    usuario = input("Nombre de usuario: ").strip()
    contraseña = input("Contraseña: ").strip()

    if not nombre or not usuario or not contraseña:
        print("❌ Todos los campos son obligatorios.")
        return

    hashed = bcrypt.hashpw(contraseña.encode('utf-8'), bcrypt.gensalt())

    conexion = conectar_bd()
    cursor = conexion.cursor()

    try:
        # Verificar si el usuario ya existe
        cursor.execute("SELECT id FROM usuarios_admin WHERE usuario = %s", (usuario,))
        if cursor.fetchone():
            print("❌ El nombre de usuario ya está registrado.")
            return

        cursor.execute("""
            INSERT INTO usuarios_admin (nombre, usuario, contraseña, rol, fecha_creacion)
            VALUES (%s, %s, %s, %s, %s)
        """, (nombre, usuario, hashed.decode('utf-8'), 'cliente', date.today()))
        conexion.commit()
        print(f"✅ Usuario cliente '{usuario}' registrado correctamente.")
    except mysql.connector.Error as e:
        print("Error al registrar el usuario:", e)
    finally:
        cursor.close()
        conexion.close()

if __name__ == "__main__":
    registrar_cliente()
    