create table carrito (
             ID_carrito SERIAL PRIMARY KEY,
			 RUT INT REFERENCES clientes (RUT),
			 fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
             
);



create table carrito_items (
             id_carrito_item SERIAL UNIQUE PRIMARY KEY,
			 id_producto INT REFERENCES productos(id_producto),
			 ID_carrito INT REFERENCES carrito(ID_carrito),
			 cantidad INT NOT NULL,
			 estado Varchar DEFAULT 'pendiente'
);


CREATE TYPE estado AS ENUM ('pendiente','enviado','recibido');


