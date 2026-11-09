# facturas-app

Ejemplo de clase de **Ingeniería Web I** (IU Digital de Antioquia, 2026-2): una aplicación web completa y sencilla en **tres bloques separados**, con una sola tabla, `producto`.

| Bloque | Carpeta | Tecnología | Qué hace |
|---|---|---|---|
| 1. Base de datos | `bd/` | SQLite (`node:sqlite`) | Guarda los productos en `facturas.db` |
| 2. API | `api/` | Node.js + Express, en 3 capas | Entrega y recibe los productos en JSON, con las reglas del negocio |
| 3. Frontend | `front/` | HTML + CSS + JavaScript (`fetch`) | Muestra, crea, modifica y elimina productos |

## Estructura

```text
facturas-app/
├── bd/
│   └── facturas.sql                     # crea la tabla producto y le carga 8 productos
├── api/
│   ├── package.json                     # la ficha del proyecto: librerias y comandos
│   ├── pruebas.http                     # las pruebas de los endpoints (extension REST Client)
│   └── src/
│       ├── servidor.js                  # prende la API en el puerto 3001
│       ├── crearBd.js                   # ejecuta facturas.sql y crea bd/facturas.db
│       ├── rutas/productoRutas.js       # CAPA 1: HTTP: recibe peticiones y responde con el codigo correcto
│       ├── servicios/productoServicio.js     # CAPA 2: reglas: validar y calcular el valor del inventario
│       └── repositorios/productoRepositorio.js  # CAPA 3: el SQL: lee y escribe en la base de datos
└── front/
    ├── index.html                       # la pagina: formulario y tabla
    ├── estilos.css                      # la apariencia
    └── app.js                           # conversa con la API con fetch
```

## Cómo ejecutarlo

Requisito: **Node.js 22 o superior**.

```powershell
cd api                 # entra a la carpeta de la API
npm install            # instala Express y cors
npm run crear-bd       # crea bd/facturas.db con los 8 productos
npm run dev            # prende la API en http://localhost:3001
```

Con la API prendida, abran `front/index.html` en el navegador (doble clic).

## Endpoints

| Método | Ruta | Qué hace | Códigos |
|---|---|---|---|
| `GET` | `/api/productos` | Lista los productos | 200 |
| `GET` | `/api/productos/:codigo` | Un producto | 200, 404 |
| `POST` | `/api/productos` | Crea un producto | 201, 400 |
| `PUT` | `/api/productos/:codigo` | Modifica un producto | 200, 400, 404 |
| `DELETE` | `/api/productos/:codigo` | Elimina un producto | 204, 404 |
