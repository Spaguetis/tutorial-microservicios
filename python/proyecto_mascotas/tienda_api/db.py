import _mysql_connector

def connect_db():
    return _mysql_connector.connect(
        host = "localhost",
        user = "root",
        password = "Mayito16",
        database = "tienda"
    )
