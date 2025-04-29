create table clientes (
            RUT SERIAL PRIMARY KEY,
			NOMBRE  Varchar (100) NOT NULL,
			prime_apellido Varchar (100) NOT NULL,
			segundo_appellido Varchar (100) NOT NULL,
			correo Varchar (100) NOT NULL,
			Telefono Int  NOT NULL,
			direccion Varchar (100) NOT NULL,
		    Clave Varchar (100) NOT NULL
);

comment on table clientes is 'in this table are the data referring to customers such as, RUT, DV, Name, Maternal Surname, Paternal Surname, Address, Telephone, Password and Mail'
comment on column clientes.RUT is 'here the customers RUT is entered'
comment on column clientes.NOMBRE is 'Here you enter the name of the client'
comment on column clientes.prime_apellido is 'Here the first surname is entered'
comment on column clientes.segundo_appellido is 'Here the secod surname is entered'
comment on column clientes.correo is 'Here the electronic email is entered'
comment on column clientes.telefono is 'Here the phone number is entered'
comment on column clientes.direccion is 'here the address is entered'
comment on column clientes.clave is 'Here the password is entered'
SELECT * FROM CLIENTES


create table mascotas (
             numero_chip SERIAL PRIMARY KEY,
			 especie VARCHAR (100) NOT NULL,
		     raza Varchar (100)  NOT NULL,
			 fecha_nacimiento INT  NOT NULL,
             peso INT  NOT NULL,
			 altura INT  NOT NULL
);

comment on table mascotas is 'In this table wwe entered the information about the clients pets'
comment on column mascotas.numero_chip is 'Here we enteed the chip number of the pet'
comment on column mascotas.especie is 'Here you entered the species'
comment on column mascotas.raza is 'Here you enteed the race'
comment on column mascotas.fecha_nacimiento is 'Here you entered the birth day of the pet'
comment on column mascotas.peso is 'Here you enteed the weight '
comment on column mascotas.altura is 'Here you entered the heigt'

CREATE TABLE productos (
             id_producto SERIAL PRIMARY KEY,
			 descripcion_corta Varchar (100) NOT NULL,
			 marca Varchar (50)  NOT NULL,
			 modelo Varchar (50) NOT NULL,
			 descripcion_laga Varchar (250) NOT NULL,
			 precio INT NOT NULL,
			 STOCK INT NOT NULL
);

comment on table productos is 'Inn this table you entered the info about the products'
comment on column productos.id_producto is  'Here you enntered the id Of the product'
comment on column productos.descripcion_corta is 'here you entered a short description about the product '
comment on column productos.marca is 'Here you entered the brand of the product'
comment on column productos.modelo is  'Here you enteed the model of the product brand'
comment on column productos.descripcion_laga is 'Here you entered a  detail description (optional)'
comment on column productos.precio is 'Here you etered the price'
comment on column productos.STOCK is 'Here you entered The quantity that is available'

ALTER TABLE mascotas
ADD COLUMN RUT INT REFERENCES clientes(RUT);
ALTER TABLE clientes 
ADD COLUMN DV CHAR NOT NULL;


ALTER TABLE clientes
ALTER COLUMN RUT
SET DATA TYPE INT ;

