// =============================================================
// CAPA 3 · REPOSITORIO: productoRepositorio.js
// QUE hace: habla con la base de datos. Aqui, y SOLO aqui, se escribe SQL.
// PARA QUE: si manana la base de datos cambia (por ejemplo, de SQLite
// a PostgreSQL), se cambia SOLO este archivo. Las otras capas no se enteran.
// =============================================================

// DatabaseSync: la base de datos SQLite que trae Node.js
import { DatabaseSync } from "node:sqlite";

// Abre el archivo de la base de datos (el bloque bd/). Queda abierto mientras la API corre
const bd = new DatabaseSync(new URL("../../../bd/facturas.db", import.meta.url));

// listar: todos los productos, ordenados por codigo
export function listar() {
    // prepare: prepara la consulta. all: la ejecuta y trae TODAS las filas (un arreglo)
    return bd.prepare("SELECT codigo, nombre, stock, valorunitario FROM producto ORDER BY codigo").all();
}

// buscar: un producto por su codigo, o undefined si no existe
export function buscar(codigo) {
    // El ? es un "hueco": get(codigo) lo llena con el codigo.
    // PARA QUE: nunca se pega el texto del usuario dentro del SQL (evita la inyeccion SQL)
    return bd.prepare("SELECT codigo, nombre, stock, valorunitario FROM producto WHERE codigo = ?").get(codigo);
}

// crear: inserta un producto nuevo
export function crear(producto) {
    // run: ejecuta una instruccion que NO trae filas (INSERT, UPDATE, DELETE).
    // Los 4 ? se llenan en orden con los 4 valores
    bd.prepare("INSERT INTO producto (codigo, nombre, stock, valorunitario) VALUES (?, ?, ?, ?)")
      .run(producto.codigo, producto.nombre, producto.stock, producto.valorunitario);
}

// actualizar: cambia el nombre, el stock y el valor de un producto.
// Devuelve true si lo encontro y lo cambio, false si no existia
export function actualizar(codigo, producto) {
    // run llena los 4 ? en orden: nombre, stock, valor y, al final, el codigo del WHERE
    const resultado = bd.prepare("UPDATE producto SET nombre = ?, stock = ?, valorunitario = ? WHERE codigo = ?")
                        .run(producto.nombre, producto.stock, producto.valorunitario, codigo);
    // changes = cuantas filas cambiaron: 1 si existia, 0 si no
    return resultado.changes > 0;
}

// eliminar: borra un producto. Devuelve true si lo borro, false si no existia
export function eliminar(codigo) {
    // Borra la fila cuyo codigo coincida
    const resultado = bd.prepare("DELETE FROM producto WHERE codigo = ?").run(codigo);
    // changes = cuantas filas se borraron: 1 si existia, 0 si no
    return resultado.changes > 0;
}
