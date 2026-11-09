// =============================================================
// crearBd.js: crea la base de datos a partir de bd/facturas.sql
// QUE hace: lee el archivo SQL y lo ejecuta en bd/facturas.db
// PARA QUE: que cualquiera cree la base con un solo comando.
// Se ejecuta con: npm run crear-bd
// =============================================================

// readFileSync: lee un archivo completo como texto
import { readFileSync } from "node:fs";
// DatabaseSync: la base de datos SQLite que ya trae Node.js (no hay que instalarla)
import { DatabaseSync } from "node:sqlite";

// Las rutas de los dos archivos del bloque de la base de datos.
// new URL(..., import.meta.url) = la ruta RELATIVA a este archivo (api/src/),
// asi funciona sin importar desde que carpeta se ejecute el comando
const archivoSql = new URL("../../bd/facturas.sql", import.meta.url);
const archivoBd = new URL("../../bd/facturas.db", import.meta.url);

// Lee el script SQL como texto ("utf8" = con tildes y enes)
const sql = readFileSync(archivoSql, "utf8");
// Abre la base de datos. Si el archivo facturas.db no existe, lo crea
const bd = new DatabaseSync(archivoBd);
// exec: ejecuta todo el script: borra la tabla, la crea y le carga los productos
bd.exec(sql);

// Cuenta los productos que quedaron, para comprobar que funciono.
// prepare: prepara una consulta; get: la ejecuta y trae UNA fila
const fila = bd.prepare("SELECT COUNT(*) AS total FROM producto").get();
// Muestra el resultado en la terminal
console.log(`Base de datos creada en bd/facturas.db con ${fila.total} productos.`);
// Cierra la base de datos
bd.close();
