-- =============================================================
-- facturas.sql: la BASE DE DATOS de facturas (bloque 1 de 3)
-- QUE hace: crea la tabla producto y le carga 8 productos.
-- PARA QUE: que los datos vivan aparte, en su propio bloque.
-- La API los lee y los escribe; el frontend NUNCA entra aqui.
-- Se ejecuta con: npm run crear-bd (desde la carpeta api)
-- =============================================================

-- Si la tabla ya existe, la borra: asi el script se puede ejecutar
-- muchas veces y siempre deja la base como nueva
DROP TABLE IF EXISTS producto;

-- La tabla producto: una fila por cada producto que se vende
CREATE TABLE producto (
    codigo        TEXT    NOT NULL PRIMARY KEY,  -- el codigo del producto: PR001. PRIMARY KEY = no se puede repetir
    nombre        TEXT    NOT NULL,              -- el nombre: Mouse HP. NOT NULL = obligatorio
    stock         INTEGER NOT NULL,              -- cuantas unidades hay en bodega
    valorunitario REAL    NOT NULL               -- cuanto vale una unidad, en pesos
);

-- Los 8 productos de ejemplo
INSERT INTO producto (codigo, nombre, stock, valorunitario) VALUES
('PR001', 'Laptop Lenovo IdeaPad', 17, 2500000),
('PR002', 'Monitor Samsung 24"', 27, 800000),
('PR003', 'Teclado Logitech K380', 42, 150000),
('PR004', 'Mouse HP', 55, 90000),
('PR005', 'Impresora Epson EcoTank1', 14, 1100000),
('PR006', 'Auriculares Sony WH-CH510', 23, 240000),
('PR007', 'Tablet Samsung Tab A9', 15, 950000),
('PR008', 'Disco Duro Seagate 1TB', 32, 280000);
