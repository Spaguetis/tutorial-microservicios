select * from info limit 10;

create schema Tienda
-- Tabla productos
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    imagen VARCHAR(255)
);

-- Tabla stock
CREATE TABLE stock (
    id_producto INT,
    fecha DATE NOT NULL,
    cantidad INT NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_producto, fecha),
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);

-- Tabla ventas (opcional)
CREATE TABLE ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE NOT NULL,
    id_producto INT,
    cantidad INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);


INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES
('Alimento seco para perro – Pedigree Adulto 20kg', 'Alimento balanceado para perros adultos de razas medianas y grandes.', 52.99, 'pedigree_adulto_20kg.jpg'),
('Arena sanitaria para gato – Sanicat 10L', 'Arena aglomerante con control de olores para gatos.', 12.50, 'sanicat_arena_10l.jpg'),
('Juguete mordedor para perro', 'Mordedor de goma con sabor a carne para entretenimiento y limpieza dental.', 7.99, 'mordedor_perro.jpg'),
('Pecera de vidrio 40L', 'Pecera ideal para peces pequeños y decoración acuática.', 35.00, 'pecera_40l.jpg'),
('Alimento para hámster – Vitapol 400g', 'Mezcla de semillas y pellets enriquecidos para hámsters.', 5.75, 'vitapol_hamster.jpg'),
('Collar ajustable para perro – Talla M', 'Collar de nylon con hebilla metálica. Disponible en varios colores.', 8.90, 'collar_perro_m.jpg'),
('Transportadora para gato o perro pequeño', 'Caja transportadora con rejilla metálica y ventilación lateral.', 25.00, 'transportadora_pequena.jpg');


select * From productos limit 10;

INSERT INTO stock (id_producto, fecha, cantidad, ubicacion) VALUES
(1, '2025-05-01', 30, 'Almacén Central'),
(2, '2025-05-01', 50, 'Sucursal 1'),
(3, '2025-05-01', 100, 'Almacén Central'),
(4, '2025-05-01', 15, 'Sucursal 2'),
(5, '2025-05-01', 60, 'Almacén Central'),
(6, '2025-05-01', 40, 'Sucursal 1'),
(7, '2025-05-01', 20, 'Sucursal 2');

select * from stock limit 10;

INSERT INTO ventas (fecha, id_producto, cantidad, total) VALUES
('2025-05-05', 1, 1, 52.99),productos
('2025-05-06', 2, 2, 25.00),
('2025-05-06', 3, 3, 23.97),
('2025-05-07', 5, 1, 5.75),
('2025-05-08', 7, 1, 25.00);
