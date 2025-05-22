import mysql.connector

#configuracion de conexion a la bd

connect = mysql.connector.connect(

         host = 'localhost',
         user = 'root',
         password = 'Mayito16',
         database = 'tienda',

)

cursor = connect.cursor()

#query
cursor.execute("SELECT id,nombre,precio from productos")
productos = cursor.fetchall()

print("====Listas de productos====")
for producto in productos:
    print(F"ID: {producto[0]} | Nombre: {producto[1]} | Precio: {producto[2]}")


    cursor.close()
    connect.close()

