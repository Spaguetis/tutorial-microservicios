import mysql.connector
from datetime import date

def conectar_bd():
    return mysql.connector.connect(
        host="localhost",
        user="root",         
        password="Mayito16",  
        database="tienda"       
    )

def ver_productos():
    conexion = conectar_bd()
    cursor = conexion.cursor()
    cursor.execute("SELECT id, nombre, precio FROM productos")
    productos = cursor.fetchall()

    print("\n=== Lista de Productos ===")
    for p in productos:
        print(f"ID: {p[0]} | Nombre: {p[1]} | Precio: ${p[2]}")
    
    cursor.close()
    conexion.close()

def ver_stock_por_producto():
    producto_id = input("Ingrese el ID del producto: ")
    conexion = conectar_bd()
    cursor = conexion.cursor()
    query = """
        SELECT s.fecha, s.cantidad, s.ubicacion
        FROM stock s
        WHERE s.id_producto = %s
        ORDER BY s.fecha DESC
    """
    cursor.execute(query, (producto_id,))
    stock = cursor.fetchall()

    print("\n=== Stock del Producto ===")
    if stock:
        for s in stock:
            print(f"Fecha: {s[0]} | Cantidad: {s[1]} | Ubicación: {s[2]}")
    else:
        print("No se encontró stock para este producto.")

    cursor.close()
    conexion.close()

def ver_ventas_recientes():
    conexion = conectar_bd()
    cursor = conexion.cursor()
    query = """
        SELECT v.fecha, p.nombre, v.cantidad, v.total
        FROM ventas v
        JOIN productos p ON v.id_producto = p.id
        ORDER BY v.fecha DESC
        LIMIT 10
    """
    cursor.execute(query)
    ventas = cursor.fetchall()

    print("\n=== Ventas Recientes ===")
    for v in ventas:
        print(f"Fecha: {v[0]} | Producto: {v[1]} | Cantidad: {v[2]} | Total: ${v[3]}")

    cursor.close()
    conexion.close()

def buscar_producto_por_nombre():
    nombre = input("Ingrese el nombre o parte del nombre del producto: ")
    conexion = conectar_bd()
    cursor = conexion.cursor()
    query = "SELECT id, nombre, precio FROM productos WHERE nombre LIKE %s"
    cursor.execute(query, ('%' + nombre + '%',))
    resultados = cursor.fetchall()

    print("\n=== Resultados de la Búsqueda ===")
    if resultados:
        for r in resultados:
            print(f"ID: {r[0]} | Nombre: {r[1]} | Precio: ${r[2]}")
    else:
        print("No se encontraron productos con ese nombre.")

    cursor.close()
    conexion.close()

def insertar_producto():
    nombre= input("Nombre del producto: ")
    descripcion = input("Breve descripcion: ")
    precio = input("precio: ")
    
    conexion = conectar_bd ()
    cursor = conexion.cursor()

    query = """
        INSERT INTO productos (nombre, descripcion, precio)
        VALUES (%s, %s, %s)
    """
    cursor.execute(query, (nombre,descripcion,precio))
    conexion.commit()

    cursor.close()
    conexion.close()

def insertar_venta():
    id_producto = input("ID del producto vendido: ")
    cantidad = input("ingrese cantidad vendida: ")

    conexion = conectar_bd()
    cursor = conexion.cursor()

    # Obtener precio del producto
    cursor.execute("SELECT precio FROM productos WHERE id = %s", (id_producto,))
    resultado = cursor.fetchone()

    if not resultado:
        print("Producto no encontrado.")
        cursor.close()
        conexion.close()
        return
    
    precio = resultado[0]
    total = precio * cantidad
    fecha_actual = date.today()

    # Insertar venta
    cursor.execute("""
        INSERT INTO ventas (fecha, id_producto, cantidad, total)
        VALUES (%s, %s, %s, %s)
    """, (fecha_actual, id_producto, cantidad, total))

    # Actualizar stock: buscar stock más reciente para el producto
    cursor.execute("""
        SELECT cantidad, fecha, ubicacion
        FROM stock
        WHERE id_producto = %s
        ORDER BY fecha DESC
        LIMIT 1
    """, (id_producto,))
    stock_data = cursor.fetchone()

    if not stock_data:
        print("Este producto no tiene stock registrado. No se actualiza stock.")
    else:
        cantidad_actual, fecha_stock, ubicacion = stock_data
        nuevo_stock = cantidad_actual - cantidad
        if nuevo_stock < 0:
            print("¡Advertencia! No hay suficiente stock. Venta registrada, pero el stock quedó negativo.")
        # Insertar nueva entrada de stock con la cantidad actualizada
        cursor.execute("""
            INSERT INTO stock (id_producto, fecha, cantidad, ubicacion)
            VALUES (%s, %s, %s, %s)
        """, (id_producto, fecha_actual, nuevo_stock, ubicacion))

    conexion.commit()
    print("Venta registrada exitosamente. Total: $", total)

    cursor.close()
    conexion.close()


    

#Menu en consola
def menu():
    while True:
        print("\n=== Menú Principal ===")
        print("1. Ver todos los productos")
        print("2. Ver stock por producto")
        print("3. Ver ventas recientes")
        print("4. Buscar producto por nombre")
        print("5. Insertar nuevo producto")
        print("6. Registrar nueva venta")
        print("7. Salir")

        opcion = input("Seleccione una opción: ")

        if opcion == '1':
            ver_productos()
        elif opcion == '2':
            ver_stock_por_producto()
        elif opcion == '3':
            ver_ventas_recientes()
        elif opcion == '4':
            buscar_producto_por_nombre()
        elif opcion == '5':
            insertar_producto()  
        elif opcion == '6':
            insertar_venta()
        elif opcion == '7':
            print("Saliendo del programa...")
            break
        else:
            print("Opción inválida. Intente de nuevo.")

# Ejecutar el menú
menu()


