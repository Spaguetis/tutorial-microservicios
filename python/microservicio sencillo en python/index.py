#conectando con bd mysql e inserccion de datos
import mysql.connector

conection = mysql.connector.connect(
    host ='localhost',
    user ='root',
    password ='Mayito16',
    database ='da_python',
)

cursor = conection.cursor()

new_user = ('234536755','gerda','andux','Tarapaca 890','gerdaandux123@gmail.com','password123')

query = 'INSERT INTO info (RUT,nombre,Primerapellido,direccion,correo,clave) Values(%s,%s,%s,%s,%s,%s)'

cursor.execute(query,new_user)

conection.commit()

print('registro con exito')

conection.close()
