create table carrito (
             ID_carrito SERIAL PRIMARY KEY,
			 RUT INT REFERENCES clientes (RUT),
			 fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
             
);

comment on table carrito is 'In this table you entered info of the car_shop of The clients'
comment on column carrito.ID_carrito is 'Here you entered the id off the car_shop'
comment on column carrito.RUT is 'Here the cart is associated with the customers RUT  '
comment on column carrito.fecha_creacion is 'Here is regitrated the creation date of the car_shp'

create table carrito_items (
             id_carrito_item SERIAL UNIQUE PRIMARY KEY,
			 id_producto INT REFERENCES productos(id_producto),
			 ID_carrito INT REFERENCES carrito(ID_carrito),
			 cantidad INT NOT NULL,
			 estado Varchar DEFAULT 'pendiente'
);

comment on table carrito_items is 'IN this table you entered the info and relationship of the products in the car_shop'
comment on column carrito_items.id_carrito_item is  'Here the products get a unique id in this car_shop diferent in all car_shop'
comment on column carrito_items.id_producto is  'Here the car_shop asociate te product whit the id products in the table of products'
comment on column carrito_items.cantidad is 'Here you entered How many are going to buy'
comment on column carrito_items.estado is 'Here you can see the sale status '
comment on column carrito_items.ID_carrito is 'Here the this table asociate to the carshop table'

CREATE TYPE estado AS ENUM ('pendiente','enviado','recibido');


