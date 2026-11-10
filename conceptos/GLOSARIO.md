# Glosario

> Todos los términos de esta carpeta, en orden alfabético, cada uno en una línea.
> Úsenlo cuando aparezca una palabra que no conozcan, y para la **tabla de
> conceptos** del PDF de la EA3. Entre paréntesis, el documento donde se explica.

| Término | Qué es |
|---|---|
| `^` (en una versión) | "Esta versión o una más nueva compatible"; sin `^` se instala la versión exacta (07) |
| API | Programa que recibe peticiones y entrega respuestas; el "mesero" entre el frontend y los datos (01) |
| `async` | Palabra que marca una función que espera resultados que tardan (05) |
| `await` | "Espera aquí hasta que llegue el resultado de la promesa", sin congelar la página (05) |
| Backend | La parte que corre en el servidor: aquí, la API con Express (01) |
| Base de datos | Lugar donde se guardan los datos de forma permanente: aquí, `bd/facturas.db` (03) |
| Bloque | Cada parte separada del proyecto: `bd/`, `api/` y `front/` (03) |
| Capa | Cada nivel de la API con un solo trabajo: rutas, servicios o repositorio (03) |
| `catch` | La parte de `try`/`catch` que se ejecuta si algo falla (05) |
| Cliente | El que hace la petición: el navegador o REST Client (01) |
| Código de estado | Número de la respuesta que dice cómo le fue: 200, 201, 204, 400, 404, 500 (01) |
| Componente | En React, una función que devuelve un pedazo de página reutilizable (06) |
| CORS | Permiso para que una página de otro origen llame a la API; lo da el middleware `cors()` (02) |
| Dependencia | Librería externa que el proyecto usa y que se anota en `package.json` (02) |
| Desestructuración | Sacar varios datos de un objeto de una vez: `{ producto, alAgregar }` (06) |
| Endpoint | Combinación de método + ruta, por ejemplo `GET /api/productos/:codigo` (01) |
| `export` / `import` | Entregar funciones desde un archivo / traerlas a otro (05) |
| `export default` | Exportar una sola cosa principal por archivo, como `export default rutas` (05) |
| Exportación estática | Convertir el proyecto de Next.js en archivos HTML, CSS y JS (`output: "export"`) (06) |
| Express | Librería de Node.js para crear el servidor web y sus rutas (02) |
| `fetch` | Función del navegador para hacer peticiones HTTP a la API (05) |
| Frontend | La parte que ve el usuario en el navegador (`front/`) (01) |
| HTTP | El "idioma" con que conversan cliente y servidor en la web (01) |
| Inyección SQL | Ataque que mete SQL en los datos del usuario; se evita con los `?` del repositorio (03) |
| JSON | Formato de texto con forma de objeto para enviar datos entre frontend y API (01) |
| Método HTTP | Lo que se quiere hacer: `GET` leer, `POST` crear, `PUT` cambiar, `DELETE` borrar (01) |
| Middleware | Función que se ejecuta en cada petición antes de las rutas, como `express.json()` (02) |
| Módulo | Archivo de JavaScript que exporta funciones para otros archivos (05) |
| Next.js | Marco de trabajo sobre React que organiza las páginas por carpetas (06) |
| Node.js | Programa que ejecuta JavaScript fuera del navegador (02) |
| `node:sqlite` | Módulo de Node.js para usar bases de datos SQLite sin instalar nada (02) |
| `node_modules/` | Carpeta con las librerías descargadas; no se sube, se recrea con `npm install` (02) |
| npm | Administrador de paquetes: descarga librerías y ejecuta scripts (02) |
| `npm audit` | Comando que revisa si las dependencias tienen vulnerabilidades conocidas (07) |
| `package.json` | Ficha del proyecto: nombre, scripts y dependencias (02) |
| Parámetro de ruta | Valor dentro de la URL, como `PR001` en `/api/productos/PR001`; se lee con `req.params` (01) |
| Parche | Versión nueva de una librería que corrige una falla (07) |
| Petición (*request*) | Mensaje que el cliente envía al servidor (01) |
| Promesa | Objeto que representa un resultado que todavía no llega, pero llegará (05) |
| Props | Datos que un componente padre le pasa a un componente hijo (06) |
| Puerto | "Número de puerta" por donde un programa recibe peticiones; la API usa el 3001 (02) |
| Query | Datos después del `?` en la URL, como `?categoria=solar`; se leen con `req.query` (01) |
| React | Librería para construir interfaces con componentes (06) |
| Regla de negocio | Regla propia del problema, como `valorinventario = stock × valorunitario` (03) |
| Repositorio | Capa 3: la única que habla con la base de datos y escribe SQL (03) |
| `req.body` | El JSON que llegó en el cuerpo de la petición, ya convertido en objeto (02) |
| Respuesta (*response*) | Mensaje que el servidor devuelve al cliente (01) |
| Responsabilidad única | Principio S de SOLID: cada parte hace una sola cosa (04) |
| Rutas | Capa 1: recibe las peticiones HTTP y responde JSON con el código correcto (03) |
| Script (de npm) | Comando con nombre corto en `package.json`, como `npm run crear-bd` (02) |
| Servicios | Capa 2: las reglas del negocio y las validaciones (03) |
| Servidor | El programa que recibe peticiones y responde: aquí, la API (01) |
| SOLID | Cinco principios para escribir código fácil de cambiar (04) |
| SQL | Lenguaje para consultar y modificar bases de datos: `SELECT`, `INSERT`, `UPDATE`, `DELETE` (03) |
| SQLite | Base de datos que vive en un solo archivo, como `facturas.db` (03) |
| `try` | La parte de `try`/`catch` donde va el código que podría fallar (05) |
| `"type": "module"` | Línea de `package.json` que activa `import` y `export` en Node.js (02) |
| `useEffect` | En React, ejecuta código después de dibujar; con `[]`, una vez al abrir la página (06) |
| `useState` | En React, guarda un dato que cambia y vuelve a dibujar al cambiarlo (06) |
| Validación | Revisar que los datos estén bien antes de guardarlos: `validar()` (03) |
| Vulnerabilidad | Falla de seguridad en una librería que alguien podría aprovechar (07) |
