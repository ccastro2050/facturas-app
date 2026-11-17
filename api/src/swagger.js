// =============================================================
// swagger.js: la DOCUMENTACION de la API, en formato OpenAPI
// QUE hace: describe cada endpoint: la ruta, el metodo, los datos
// que recibe y las respuestas posibles (200, 201, 204, 400, 404).
// PARA QUE: swagger-ui-express la convierte en una pagina web,
// http://localhost:3001/api-docs, donde se lee y se prueba la API.
// =============================================================

// El esquema de un producto: lo usan varias respuestas, se escribe una vez
const producto = {
    // type: object = un objeto JSON con propiedades
    type: "object",
    properties: {
        // example = el valor de ejemplo que muestra la pagina
        codigo: { type: "string", example: "PR004" },
        nombre: { type: "string", example: "Mouse HP" },
        // integer = numero entero
        stock: { type: "integer", example: 55 },
        // number = numero con o sin decimales
        valorunitario: { type: "number", example: 90000 },
        // readOnly: lo calcula el servicio, no se envia
        valorinventario: { type: "number", example: 4950000, readOnly: true },
    },
};

// Los datos que se envian al crear (POST) un producto
const productoNuevo = {
    type: "object",
    // required = los campos obligatorios
    required: ["codigo", "nombre", "stock", "valorunitario"],
    properties: {
        // maxLength: igual que la validacion del servicio (maximo 10)
        codigo: { type: "string", maxLength: 10, example: "PR009" },
        nombre: { type: "string", example: "Parlante Bluetooth JBL" },
        // minimum: el stock no puede ser negativo
        stock: { type: "integer", minimum: 0, example: 20 },
        // exclusiveMinimum: el valor debe ser MAYOR que 0
        valorunitario: { type: "number", minimum: 0, exclusiveMinimum: true, example: 350000 },
    },
};

// Los datos que se envian al modificar (PUT): todo menos el codigo, que va en la URL
const productoCambios = {
    type: "object",
    required: ["nombre", "stock", "valorunitario"],
    properties: {
        nombre: { type: "string", example: "Parlante Bluetooth JBL Flip" },
        stock: { type: "integer", minimum: 0, example: 18 },
        valorunitario: { type: "number", minimum: 0, exclusiveMinimum: true, example: 330000 },
    },
};

// El parametro :codigo de la URL, que usan GET, PUT y DELETE de un producto
const parametroCodigo = {
    // name = como se llama; in: path = va dentro de la ruta
    name: "codigo",
    in: "path",
    required: true,
    description: "El codigo del producto",
    schema: { type: "string", example: "PR004" },
};

// Las respuestas de error, escritas una vez
const error404 = {
    description: "Producto no encontrado",
    content: { "application/json": { example: { error: "Producto no encontrado" } } },
};
const error400 = {
    description: "Datos malos: la validacion del servicio dice todos los errores",
    content: { "application/json": { example: { errores: ["El nombre es obligatorio."] } } },
};

// El documento completo
const documentacion = {
    // La version del formato OpenAPI
    openapi: "3.0.3",
    // info: el titulo y la descripcion que salen arriba de la pagina
    info: {
        title: "API de facturas",
        version: "1.0.0",
        description: "La API del ejemplo de facturas: 5 endpoints para la tabla producto.",
    },
    // servers: a donde se envian las peticiones de "Try it out"
    servers: [{ url: "http://localhost:3001" }],
    // paths: cada ruta, con sus metodos
    paths: {
        "/api/productos": {
            // get: listar
            get: {
                // tags: agrupa los endpoints en la pagina
                tags: ["Productos"],
                summary: "Todos los productos",
                responses: {
                    // 200 = OK; type array = una lista de productos
                    200: {
                        description: "La lista de productos",
                        content: { "application/json": { schema: { type: "array", items: producto } } },
                    },
                },
            },
            // post: crear
            post: {
                tags: ["Productos"],
                summary: "Crear un producto",
                // requestBody: el JSON que se envia
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: productoNuevo } },
                },
                responses: {
                    201: { description: "Creado", content: { "application/json": { schema: producto } } },
                    400: error400,
                },
            },
        },
        // {codigo} = la parte de la ruta que cambia (en Express se escribe :codigo)
        "/api/productos/{codigo}": {
            get: {
                tags: ["Productos"],
                summary: "Un producto",
                parameters: [parametroCodigo],
                responses: {
                    200: { description: "El producto", content: { "application/json": { schema: producto } } },
                    404: error404,
                },
            },
            put: {
                tags: ["Productos"],
                summary: "Modificar un producto",
                parameters: [parametroCodigo],
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: productoCambios } },
                },
                responses: {
                    200: { description: "Modificado", content: { "application/json": { schema: producto } } },
                    400: error400,
                    404: error404,
                },
            },
            delete: {
                tags: ["Productos"],
                summary: "Eliminar un producto",
                parameters: [parametroCodigo],
                responses: {
                    // 204 = hecho, sin cuerpo
                    204: { description: "Eliminado, sin nada que devolver" },
                    404: error404,
                },
            },
        },
    },
};

// Lo que entrega este archivo: el documento, para servidor.js
export default documentacion;
