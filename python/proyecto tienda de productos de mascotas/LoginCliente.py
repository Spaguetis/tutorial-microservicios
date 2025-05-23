import mysql.connector

def conectar_bd():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Mayito16",
        database="tienda"
    )

def login_cliente():
    usuario = input("Ingrese su nombre de usuario: ")
    contraseña = input("Ingrese su contraseña: ")

    conexion = conectar_bd()
    cursor = conexion.cursor()

    query = """
        SELECT id, usuario, rol
        FROM usuarios
        WHERE usuario = %s AND contraseña = %s AND rol = 'cliente'
    """
    cursor.execute(query, (usuario, contraseña))
    resultado = cursor.fetchone()

    if resultado:
        print(f"\n¡Bienvenido, {usuario}!")
        mostrar_productos()
    else:
        print("\nCredenciales incorrectas o no eres un cliente registrado.")

    cursor.close()
    conexion.close()

def mostrar_productos():
    conexion = conectar_bd()
    cursor = conexion.cursor()
    cursor.execute("SELECT nombre, descripcion, precio FROM productos")
    productos = cursor.fetchall()

    print("\n=== Productos Disponibles ===")
    for p in productos:
        print(f"Nombre: {p[0]}\nDescripción: {p[1]}\nPrecio: ${p[2]}\n---")

    cursor.close()
    conexion.close()

if __name__ == "__main__":
    login_cliente()
