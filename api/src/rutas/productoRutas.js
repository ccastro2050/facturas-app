// =============================================================
// CAPA 1 · RUTAS: productoRutas.js
// QUE hace: recibe las peticiones HTTP y responde en JSON con el
// codigo de estado correcto (200, 201, 204, 400, 404).
// PARA QUE: separar la parte "web" de las reglas. Esta capa NO
// valida, NO calcula y NO escribe SQL: se lo pide al servicio.
// =============================================================

// Router: un grupo de rutas que despues se conecta en el servidor
import { Router } from "express";
// Las funciones de la capa de abajo: el servicio
import * as servicio from "../servicios/productoServicio.js";

const rutas = Router();

// GET /api/productos -> todos los productos
rutas.get("/", (req, res) => {
    // res.json: responde con los datos en JSON. Codigo 200 por defecto
    res.json(servicio.listarProductos());
});

// GET /api/productos/PR001 -> un producto
rutas.get("/:codigo", (req, res) => {
    // req.params.codigo = lo que va en lugar de :codigo en la URL
    const producto = servicio.obtenerProducto(req.params.codigo);
    if (!producto) {
        // 404 = no existe
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(producto);
});

// POST /api/productos -> crea un producto con el JSON del cuerpo
rutas.post("/", (req, res) => {
    // req.body = el JSON que llego. ?? {} = si llego sin cuerpo, un objeto vacio
    const resultado = servicio.crearProducto(req.body ?? {});
    if (resultado.errores) {
        // 400 = la peticion esta mal hecha (datos malos)
        return res.status(400).json({ errores: resultado.errores });
    }
    // 201 = creado
    res.status(201).json(resultado.producto);
});

// PUT /api/productos/PR001 -> modifica un producto
rutas.put("/:codigo", (req, res) => {
    const resultado = servicio.actualizarProducto(req.params.codigo, req.body ?? {});
    if (resultado.errores) {
        return res.status(400).json({ errores: resultado.errores });
    }
    if (!resultado.producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(resultado.producto);
});

// DELETE /api/productos/PR001 -> borra un producto
rutas.delete("/:codigo", (req, res) => {
    if (!servicio.eliminarProducto(req.params.codigo)) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    // 204 = hecho, sin nada que devolver
    res.status(204).end();
});

// Lo que entrega este archivo: el grupo de rutas
export default rutas;
