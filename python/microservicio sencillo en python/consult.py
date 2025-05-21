import mysql.connector

conection = mysql.connector.connect(
    host ='localhost',
    user ='root',
    password ='Mayito16',
    database ='da_python',
)

cursor = conection.cursor()

cursor.execute("SELECT * FROM info")

cursorresult = cursor.fetchall()

for x in cursorresult:
    print(x)

