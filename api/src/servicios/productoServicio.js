// =============================================================
// CAPA 2 · SERVICIOS: productoServicio.js
// QUE hace: las REGLAS DEL NEGOCIO: validar los datos y calcular
// el valor del inventario de cada producto.
// PARA QUE: que las reglas esten en un solo lugar. Esta capa no sabe
// de URL ni de codigos HTTP, y no escribe SQL.
// =============================================================

// Las funciones de la capa de abajo: el repositorio
import * as repositorio from "../repositorios/productoRepositorio.js";

// conValorInventario: le agrega a un producto cuanto vale todo su stock.
// Regla del negocio: valor del inventario = stock x valor unitario
function conValorInventario(producto) {
    // { ...producto, ... } = un objeto nuevo con todos los datos del producto, mas el calculo
    return { ...producto, valorinventario: producto.stock * producto.valorunitario };
}

// validar: revisa los datos. Devuelve una LISTA de errores (vacia [] si todo esta bien).
// conCodigo = true cuando se crea (hay que revisar el codigo); false cuando se actualiza
function validar(datos, conCodigo) {
    const errores = [];
    // El codigo: obligatorio al crear, de 1 a 10 letras o numeros
    if (conCodigo && (typeof datos.codigo !== "string" || datos.codigo.trim() === "" || datos.codigo.length > 10)) {
        errores.push("El codigo es obligatorio y tiene maximo 10 caracteres.");
    }
    // El nombre: obligatorio
    if (typeof datos.nombre !== "string" || datos.nombre.trim() === "") {
        errores.push("El nombre es obligatorio.");
    }
    // El stock: un numero entero, 0 o mas. Number.isInteger(5) = true; Number.isInteger(5.5) = false
    if (!Number.isInteger(datos.stock) || datos.stock < 0) {
        errores.push("El stock debe ser un numero entero mayor o igual que 0.");
    }
    // El valor unitario: un numero mayor que 0
    if (typeof datos.valorunitario !== "number" || datos.valorunitario <= 0) {
        errores.push("El valor unitario debe ser un numero mayor que 0.");
    }
    return errores;
}

// --- Lo que usa la capa de rutas (por eso lleva export) ---

// listarProductos: todos, cada uno con su valor de inventario
export function listarProductos() {
    // map: aplica conValorInventario a cada producto
    return repositorio.listar().map(conValorInventario);
}

// obtenerProducto: uno, o undefined si no existe
export function obtenerProducto(codigo) {
    const producto = repositorio.buscar(codigo);
    // condicion ? si : no
    return producto ? conValorInventario(producto) : undefined;
}

// crearProducto: valida, revisa que el codigo no exista y guarda.
// Devuelve { errores } si algo esta mal, o { producto } si se creo
export function crearProducto(datos) {
    const errores = validar(datos, true);
    if (errores.length > 0) {
        return { errores };
    }
    // Regla: no puede haber dos productos con el mismo codigo
    if (repositorio.buscar(datos.codigo.trim())) {
        return { errores: [`Ya existe un producto con el codigo ${datos.codigo.trim()}.`] };
    }
    // Arma el producto solo con los 4 datos de la tabla (ignora cualquier otro que llegue)
    const producto = {
        codigo: datos.codigo.trim(),
        nombre: datos.nombre.trim(),
        stock: datos.stock,
        valorunitario: datos.valorunitario
    };
    repositorio.crear(producto);
    return { producto: conValorInventario(producto) };
}

// actualizarProducto: valida y cambia. Devuelve { errores }, { producto } o {} si no existe
export function actualizarProducto(codigo, datos) {
    const errores = validar(datos, false);
    if (errores.length > 0) {
        return { errores };
    }
    const cambios = { nombre: datos.nombre.trim(), stock: datos.stock, valorunitario: datos.valorunitario };
    const existia = repositorio.actualizar(codigo, cambios);
    // Si no existia, objeto vacio: la ruta respondera 404
    return existia ? { producto: conValorInventario({ codigo, ...cambios }) } : {};
}

// eliminarProducto: true si lo borro, false si no existia
export function eliminarProducto(codigo) {
    return repositorio.eliminar(codigo);
}
