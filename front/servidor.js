// =============================================================
// servidor.js: el servidor del FRONTEND (bloque 3 de 3)
// QUE hace: le da al frontend su propia direccion,
// http://localhost:3000, separada de la API (puerto 3001).
// Solo entrega los archivos de esta carpeta: index.html, estilos.css y app.js.
// Se ejecuta con: npm start
// =============================================================

// express: la misma libreria de la API, aqui solo para entregar archivos
import express from "express";

// El puerto del frontend: 3000 (la API usa el 3001)
const PUERTO = 3000;

// Crea la aplicacion
const app = express();

// express.static(carpeta): entrega tal cual los archivos de la carpeta front.
// import.meta.dirname = la carpeta donde esta este archivo (front)
// Si piden "/", entrega index.html
app.use(express.static(import.meta.dirname));

// Pone el frontend a escuchar. error = lo que fallo (por ejemplo, el puerto ocupado)
app.listen(PUERTO, (error) => {
    if (error) {
        console.error(`No se pudo iniciar el frontend: el puerto ${PUERTO} esta ocupado (${error.code}).`);
        return;
    }
    console.log(`Frontend de facturas en http://localhost:${PUERTO}`);
    console.log("Recuerden: la API tambien debe estar prendida, en otra terminal.");
});
