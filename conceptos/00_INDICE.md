# Conceptos: API, capas y React

> En esta carpeta están, explicadas con palabras sencillas, las ideas que se usan
> en el ejemplo de clase (**facturas**: una base de datos, una API y un frontend)
> y que después ustedes aplican en la **EA3** para construir **EcoTienda** con
> una API y React. Les sirve para entender el código y para explicarlo en el video.

## Qué hay en la carpeta

```
conceptos/                          # esta carpeta: los documentos de conceptos
├── 00_INDICE.md                    # este archivo: qué leer y en qué orden
├── 01_QUE_ES_UNA_API.md            # cliente, servidor, HTTP, métodos, códigos, JSON
├── 02_NODE_NPM_EXPRESS.md          # Node.js, npm, package.json y Express
├── 03_PROGRAMACION_POR_CAPAS.md    # los 3 bloques y las 3 capas de la API
├── 04_PRINCIPIOS_SOLID.md          # los 5 principios SOLID, muy simples
├── 05_MODULOS_Y_ASINCRONIA.md      # import/export, promesas, async/await, fetch
├── 06_REACT_Y_NEXT.md              # componentes, props, useState, useEffect, Next.js (EA3)
├── 07_SEGURIDAD_DE_DEPENDENCIAS.md # vulnerabilidades, npm audit, versión de Next
├── GLOSARIO.md                     # todos los términos, uno por línea
└── img/                            # los diagramas (imágenes PNG) de los documentos
```

## En qué orden leerlos

| Orden | Documento | Léanlo cuando... |
|---|---|---|
| 1 | `01_QUE_ES_UNA_API.md` | antes de empezar: es la base de todo |
| 2 | `02_NODE_NPM_EXPRESS.md` | al crear la carpeta `api/` y ejecutar `npm install` |
| 3 | `03_PROGRAMACION_POR_CAPAS.md` | al escribir las carpetas `rutas/`, `servicios/` y `repositorios/` |
| 4 | `04_PRINCIPIOS_SOLID.md` | después de entender las capas |
| 5 | `05_MODULOS_Y_ASINCRONIA.md` | antes de conectar el frontend con la API |
| 6 | `06_REACT_Y_NEXT.md` | al empezar el frontend de la EA3 con React |
| 7 | `07_SEGURIDAD_DE_DEPENDENCIAS.md` | antes de entregar la EA3 (`npm audit`) |
| — | `GLOSARIO.md` | siempre que aparezca una palabra que no conozcan |

## El ejemplo de clase: facturas

Una sola tabla, `producto`, con 8 productos de tecnología (del `PR001` Laptop
Lenovo IdeaPad al `PR008` Disco Duro Seagate 1TB). El proyecto tiene **tres
bloques separados**:

```
facturas-app/                           # el ejemplo de clase
├── .gitignore                          # le dice a Git que no suba bd/*.db
├── bd/                                 # bloque 1: la base de datos
│   ├── facturas.sql                    # el script que crea la tabla producto y sus 8 filas
│   └── facturas.db                     # el archivo de SQLite (se crea con npm run crear-bd)
├── api/                                # bloque 2: la API (Node.js + Express)
│   ├── .gitignore                      # le dice a Git que no suba node_modules/
│   ├── package.json                    # nombre, scripts y dependencias de la API
│   ├── pruebas.http                    # las 9 peticiones de prueba (extensión REST Client)
│   └── src/                            # el código fuente de la API
│       ├── crearBd.js                  # lee bd/facturas.sql y crea bd/facturas.db
│       ├── servidor.js                 # punto de entrada: crea Express y escucha en el puerto 3001
│       ├── rutas/                      # capa 1: la parte web (HTTP)
│       │   └── productoRutas.js        # GET, POST, PUT, DELETE de /api/productos
│       ├── servicios/                  # capa 2: las reglas del negocio
│       │   └── productoServicio.js     # validar() y conValorInventario()
│       └── repositorios/               # capa 3: el acceso a los datos
│           └── productoRepositorio.js  # el único archivo con SQL (node:sqlite)
└── front/                              # bloque 3: el frontend
    ├── index.html                      # la página: formulario y tabla de productos
    ├── estilos.css                     # la apariencia de la página
    └── app.js                          # el JavaScript: llama a la API con fetch
```

En la **EA3** se hace lo mismo con la tienda de cada equipo (EcoTienda), y el
frontend se construye con **React y Next.js** en vez de HTML y JavaScript sueltos.

Consejo: lean cada documento con el código abierto al lado en VS Code.
