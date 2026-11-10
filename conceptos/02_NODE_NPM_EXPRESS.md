# 2. Node.js, npm y Express

> Aquí van a aprender qué es Node.js, para qué sirve npm, qué hay dentro de
> `package.json` y cómo Express crea el servidor. En la EA3 lo necesitan para
> crear la carpeta `api/`, instalarla, ejecutarla y explicarlo en el README.

## 2.1 Node.js: JavaScript fuera del navegador

Hasta ahora, el JavaScript corría **dentro del navegador**. **Node.js** es un
programa que permite ejecutar JavaScript **en el computador**, sin navegador.
Así se puede escribir un servidor con el mismo lenguaje que ya conocen.

Analogía: JavaScript es un cocinero que solo sabía trabajar en una cocina
(el navegador). Node.js le da una segunda cocina (el computador o servidor).

Node.js trae módulos propios. Uno de ellos es **`node:sqlite`**, con el que la
API del ejemplo de facturas lee y escribe en `bd/facturas.db` sin instalar nada más.
Como todavía es "experimental", Node.js muestra un aviso (*ExperimentalWarning*);
los scripts de `package.json` lo ocultan con `--disable-warning=ExperimentalWarning`.

```bash
node --version   # muestra la versión instalada (la EA3 pide 22 o superior)
```

## 2.2 npm: la tienda de librerías

**npm** (*Node Package Manager*, administrador de paquetes de Node) se instala
junto con Node.js. Sirve para **descargar librerías** que otras personas ya
escribieron, en vez de programarlo todo desde cero.

| Comando | Qué hace |
|---|---|
| `npm init -y` | Crea un `package.json` nuevo |
| `npm install express cors` | Descarga esas librerías y las anota en `package.json` |
| `npm install` | Descarga **todas** las librerías anotadas en `package.json` |
| `npm run crear-bd` | Ejecuta el script `crear-bd`: crea `bd/facturas.db` con sus 8 productos |
| `npm run dev` | Ejecuta el script `dev`: arranca la API |
| `npm audit` | Revisa si las librerías tienen fallas de seguridad (ver documento 07) |

## 2.3 package.json: la ficha del proyecto

El `package.json` de `facturas-app/api`, explicado línea por línea
(JSON no admite comentarios: aquí se ponen solo para explicar, y se omiten
`--disable-warning=ExperimentalWarning` y los campos vacíos para que se lea mejor):

```jsonc
{
  "name": "api",                                   // nombre del proyecto
  "version": "1.0.0",                              // versión del proyecto
  "scripts": {                                     // atajos que se ejecutan con npm run
    "crear-bd": "node src/crearBd.js",             // npm run crear-bd: crea bd/facturas.db
    "dev": "node --watch src/servidor.js",         // npm run dev: arranca y se reinicia solo al guardar
    "start": "node src/servidor.js"                // npm start: arranca sin reinicio automático
  },
  "type": "module",                                // usar import/export (módulos ES) en vez de require
  "dependencies": {                                // las librerías que el proyecto necesita
    "cors": "^2.8.6",                              // permite que el frontend llame a la API
    "express": "^5.3.0"                            // la librería que crea el servidor
  }
}
```

- **scripts**: comandos con nombre corto. `npm run dev` es más fácil que
  escribir `node --watch src/servidor.js`.
- **dependencies**: la lista de compras. Con ella, cualquier persona del equipo
  ejecuta `npm install` y obtiene las mismas librerías.
- **"type": "module"**: le dice a Node.js que el código usa `import` y `export`
  (se explica en el documento 05).
- El `^` en `"^5.3.0"` significa "esta versión o una más nueva compatible".
  En el documento 07 se explica por qué en Next.js se quita.

## 2.4 node_modules: no se sube

Cuando se ejecuta `npm install`, npm crea la carpeta **`node_modules/`** con el
código de todas las librerías. Es **muy pesada** (miles de archivos) y se puede
volver a crear en cualquier momento con `npm install`.

Por eso **no se sube a GitHub ni va en el .zip** de la entrega. Lo mismo pasa con
el archivo de la base de datos, que se recrea con `npm run crear-bd`. En
`facturas-app` hay dos archivos `.gitignore`:

```
facturas-app/.gitignore   →  bd/*.db         # no subir la base de datos: se recrea con el script
api/.gitignore            →  node_modules/   # no subir las librerías: se recrean con npm install
```

Analogía: no se envía la nevera llena; se envía la **lista de mercado**
(`package.json`) y cada quien hace su mercado (`npm install`).

## 2.5 Express: el servidor web

**Express** es una librería que facilita crear un servidor web en Node.js:
recibe peticiones, las manda a la función que corresponde y envía la respuesta.
Lo esencial de `api/src/servidor.js`:

```js
import express from "express";                         // trae la librería Express
import cors from "cors";                               // trae la librería cors
import productoRutas from "./rutas/productoRutas.js";  // trae la capa de rutas

const PUERTO = 3001;                                   // el puerto donde escuchará la API
const app = express();                                 // crea la aplicación (el servidor)

app.use(cors());                                       // middleware: permite peticiones del frontend
app.use(express.json());                               // middleware: convierte el JSON recibido en req.body

app.use("/api/productos", productoRutas);              // conecta las rutas debajo de /api/productos

app.use((req, res) => {                                // si ninguna ruta coincidió...
    res.status(404).json({ error: "Ruta no encontrada" }); // ...responde 404 en JSON
});

app.listen(PUERTO, (error) => {                        // pone el servidor a escuchar
    // si hay error (puerto ocupado) avisa; si no, muestra "API de facturas en http://localhost:3001"
});
```

Al final, `servidor.js` tiene además un **manejador de errores** (una función con
4 parámetros: `err, req, res, next`) que responde **400** si llega un JSON mal
escrito y **500** si algo falla, siempre en JSON.

## 2.6 Middleware: los filtros del camino

Un **middleware** es una función que se ejecuta en **cada petición, antes de
llegar a la ruta**. Es como el portero de un edificio: revisa o prepara a cada
visitante antes de dejarlo subir.

| Middleware | Qué hace | Sin él... |
|---|---|---|
| `cors()` | Da permiso para que una página de **otro origen** (otro puerto) llame a la API | El navegador bloquea las peticiones del frontend |
| `express.json()` | Lee el JSON que llega en el cuerpo y lo deja en `req.body` como objeto | `req.body` llega vacío (`undefined`) |

## 2.7 El puerto

El **puerto** es el "número de puerta" por donde un programa recibe peticiones
en el computador. Un edificio (el computador, `localhost`) tiene muchas puertas,
y dos programas no pueden usar la misma.

| Programa | Puerto |
|---|---|
| La API de facturas (Express) | 3001 (`http://localhost:3001`) |
| El frontend de Next.js en la EA3 | 3000 |

Si aparece un error de "puerto ocupado", es porque la API ya está corriendo en
otra terminal: ciérrenla u opriman `Ctrl + C` en ella.

## 2.8 Para la EA3

En el README expliquen los pasos: `cd api`, `npm install`, `npm run crear-bd`, `npm run dev`.
