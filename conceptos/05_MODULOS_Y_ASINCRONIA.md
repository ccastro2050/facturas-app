# 5. Módulos y asincronía

> Aquí van a aprender cómo se reparten las funciones entre archivos (`import` y
> `export`) y cómo el frontend le pide datos a la API sin congelar la página
> (promesas, `async`/`await`, `fetch` y `try`/`catch`). En la EA3 lo necesitan
> para el módulo `lib/api.js` y para la tabla de conceptos del PDF (módulos,
> promesas, `fetch`).

## 5.1 Módulos: export e import

Un **módulo** es un archivo de JavaScript que **entrega** (`export`) algunas de
sus funciones para que otros archivos las **usen** (`import`). Es como una caja
de herramientas con etiqueta: cada archivo dice qué herramientas presta.

Para que Node.js acepte `import` y `export`, el `package.json` lleva `"type": "module"`.

| Forma | Cómo se exporta | Cómo se importa | Ejemplo real |
|---|---|---|---|
| **Por defecto** (*default*): una sola cosa por archivo | `export default rutas;` | `import productoRutas from "./rutas/productoRutas.js";` (el nombre lo elige quien importa) | `productoRutas.js` → `servidor.js` |
| **Con nombre**: varias cosas por archivo | `export function obtenerProducto(codigo) { ... }` | `import { obtenerProducto } from "...";` (mismo nombre, entre llaves) | `productoServicio.js` |
| **Todo con nombre, en un objeto** | (las mismas funciones con nombre) | `import * as servicio from "../servicios/productoServicio.js";` | `productoRutas.js` usa `servicio.obtenerProducto()` |
| **Módulo de Node.js** | (ya viene con Node.js) | `import { DatabaseSync } from "node:sqlite";` | `productoRepositorio.js` |

Lo que **no** lleva `export` queda privado: `validar()` y `conValorInventario()`
solo se usan dentro de `productoServicio.js`.

## 5.2 Sincrónico y asincrónico

- **Sincrónico**: una cosa después de otra; cada línea espera a la anterior.
- **Asincrónico**: se pide algo que **tarda** (ir a la API por la red) y, mientras
  llega, la página sigue funcionando.

Analogía: en un restaurante de comida rápida, se hace el pedido y se recibe un
**ficho**. No se queda uno parado en la caja: se sienta, y cuando llaman el
número, recoge la comida.

## 5.3 Promesas

Una **promesa** (*Promise*) es ese ficho: un objeto que dice "el resultado todavía
no está, pero llegará". Puede terminar **bien** (llegan los datos) o **mal**
(por ejemplo, la API está apagada).

`fetch()` devuelve una promesa. Y `respuesta.json()` también.

## 5.4 async y await

- **`async`** antes de una función: avisa que adentro hay cosas que se esperan.
- **`await`** antes de una promesa: "espera aquí hasta que llegue el resultado"
  (sin congelar la página).

## 5.5 fetch y try/catch: el frontend de facturas

**`fetch`** es la función del navegador para hacer peticiones HTTP.
**`try`/`catch`** atrapa los errores: si algo falla dentro del `try`, salta al
`catch` en vez de romper la página. Así lo usa `front/app.js`:

```js
const API = "http://localhost:3001/api/productos";  // la dirección de la API: se cambia SOLO aquí

async function cargarProductos() {                   // async: adentro se esperan respuestas
    try {                                            // intenta...
        const respuesta = await fetch(API);          // GET a la API; await espera la respuesta
        const productos = await respuesta.json();    // convierte el texto JSON en un arreglo
        // ... con map arma una fila <tr> por producto y llena la tabla
    } catch (error) {                                // ...si falla (la API está apagada):
        mostrarMensaje("No se pudo conectar con la API. ¿Está prendida? (npm run dev en la carpeta api)", "error");
    }
}
```

Para **enviar** datos (crear con `POST` o modificar con `PUT`), `fetch` recibe un
segundo parámetro con el método, el tipo de contenido y el cuerpo (función `guardar()`):

```js
const respuesta = await fetch(url, {                  // fetch CON datos: el segundo dato dice cómo
    method: metodo,                                   // "POST" si es nuevo, "PUT" si se está editando
    headers: { "Content-Type": "application/json" },  // le avisa a la API que va JSON
    body: JSON.stringify(leerFormulario())            // convierte el objeto en texto JSON
});
const datos = await respuesta.json();                 // la respuesta de la API, como objeto
if (!respuesta.ok) {                                  // ok = false si el código NO es 2xx (400, 404)
    mostrarMensaje(datos.errores ? datos.errores.join(" ") : datos.error, "error"); // muestra los errores
    return;                                           // y no sigue
}
```

Ojo: `fetch` **no** salta al `catch` con un 400 o un 404 (la API sí respondió).
Por eso se revisa `respuesta.ok`. El `catch` es para cuando **no hay respuesta**.

## 5.6 En la EA3: el módulo lib/api.js

En EcoTienda con Next.js, las llamadas a la API van en un módulo aparte,
`lib/api.js`, con `export`, y los componentes las usan con `import`.
Un boceto de cómo se vería (la versión final se construye en clase):

```js
// lib/api.js
const API = "http://localhost:3001/api";                  // la dirección base de la API

export async function obtenerProductos() {               // export con nombre: la usan los componentes
    const respuesta = await fetch(`${API}/productos`);   // GET /api/productos
    if (!respuesta.ok) {                                 // si la API respondió con error...
        throw new Error("No se pudieron cargar los productos"); // ...lanza un error para el catch
    }
    return respuesta.json();                             // devuelve la promesa con el arreglo
}
```

```js
// en un componente:
import { obtenerProductos } from "../lib/api.js";        // trae la función del módulo
```
