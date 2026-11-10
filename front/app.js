// =============================================================
// app.js: el JavaScript del frontend
// QUE hace: le pide los productos a la API con fetch, los muestra
// en la tabla, y envia a la API lo que se crea, modifica o borra.
// PARA QUE: el frontend no guarda datos. Todo pasa por la API.
// =============================================================

// La direccion de la API. Si la API cambia de puerto, se cambia SOLO aqui
const API = "http://localhost:3001/api/productos";

// Cuando se esta modificando un producto, aqui va su codigo. null = se esta creando uno nuevo
let codigoEditando = null;

// pesos: escribe un numero como plata colombiana: 2500000 -> "$2.500.000"
function pesos(valor) {
    return "$" + Math.round(valor).toLocaleString("es-CO");
}

// mostrarMensaje: escribe un mensaje arriba de la pagina.
// tipo = "exito" (verde) o "error" (rojo)
function mostrarMensaje(texto, tipo) {
    // Busca el <div id="mensaje"> de index.html
    const mensaje = document.getElementById("mensaje");
    // textContent: el texto que se ve
    mensaje.textContent = texto;
    // className: las clases de Bootstrap. alert-success = verde; alert-danger = rojo.
    // Al cambiar className se quita d-none, y el mensaje aparece
    mensaje.className = "alert " + (tipo === "exito" ? "alert-success" : "alert-danger");
}

// cargarProductos: GET a la API y llena la tabla.
// async = la funcion ESPERA respuestas de la red sin congelar la pagina
async function cargarProductos() {
    // try: intenta; si algo falla (por ejemplo, la API esta apagada), salta al catch
    try {
        // fetch: hace la peticion. await: espera la respuesta. Sin metodo = GET
        const respuesta = await fetch(API);
        // .json(): convierte el texto JSON de la respuesta en un arreglo de objetos
        const productos = await respuesta.json();
        // map: convierte cada producto en una fila <tr> de texto HTML; join(""): las pega todas.
        // Clases de Bootstrap: text-end = numero a la derecha; btn btn-sm = boton pequeno;
        // btn-outline-primary = borde azul; btn-outline-danger = borde rojo.
        // codigo y valor-inventario son clases propias, de estilos.css
        document.getElementById("filas").innerHTML = productos.map((p) => `
            <tr>
                <td class="codigo">${p.codigo}</td>
                <td>${p.nombre}</td>
                <td class="text-end">${p.stock}</td>
                <td class="text-end">${pesos(p.valorunitario)}</td>
                <td class="text-end valor-inventario">${pesos(p.valorinventario)}</td>
                <td class="text-nowrap">
                    <button onclick="editar('${p.codigo}')" class="btn btn-sm btn-outline-primary">Editar</button>
                    <button onclick="eliminar('${p.codigo}')" class="btn btn-sm btn-outline-danger">Eliminar</button>
                </td>
            </tr>`).join("");
    } catch (error) {
        // Si fetch fallo: la API no respondio
        mostrarMensaje("No se pudo conectar con la API. ¿Está prendida? (npm run dev en la carpeta api)", "error");
    }
}

// leerFormulario: arma un objeto con lo que escribio el usuario.
// Number(...) convierte el texto del input en numero: "20" -> 20
function leerFormulario() {
    // .value = lo que el usuario escribio en cada campo
    return {
        codigo: document.getElementById("codigo").value,
        nombre: document.getElementById("nombre").value,
        stock: Number(document.getElementById("stock").value),
        valorunitario: Number(document.getElementById("valorunitario").value)
    };
}

// limpiarFormulario: borra los campos y vuelve al modo "nuevo producto"
function limpiarFormulario() {
    // reset: deja todos los campos vacios
    document.getElementById("formulario").reset();
    // Vuelve a dejar escribir el codigo (al editar se bloquea)
    document.getElementById("codigo").disabled = false;
    // Vuelve el titulo del formulario a "Nuevo producto"
    document.getElementById("tituloFormulario").textContent = "Nuevo producto";
    // null = ya no se esta editando ningun producto
    codigoEditando = null;
}

// guardar: se ejecuta al enviar el formulario. POST si es nuevo, PUT si se esta editando
async function guardar(evento) {
    // preventDefault: evita que el navegador recargue la pagina al enviar el formulario
    evento.preventDefault();
    // condicion ? si : no -> la URL y el metodo dependen de si se esta editando
    const url = codigoEditando ? `${API}/${codigoEditando}` : API;
    const metodo = codigoEditando ? "PUT" : "POST";
    // try: si la API esta apagada, salta al catch
    try {
        // fetch con datos: el metodo, el encabezado y el cuerpo
        const respuesta = await fetch(url, {
            method: metodo,                                    // POST o PUT
            headers: { "Content-Type": "application/json" },   // le dice a la API que va JSON
            body: JSON.stringify(leerFormulario())              // el objeto convertido en texto JSON
        });
        // Lee la respuesta de la API: el producto guardado, o los errores
        const datos = await respuesta.json();
        // respuesta.ok = true si el codigo es 2xx (200, 201)
        if (!respuesta.ok) {
            // 400 o 404: la API explica que esta mal. join(" "): une la lista de errores
            mostrarMensaje(datos.errores ? datos.errores.join(" ") : datos.error, "error");
            return;
        }
        // Salio bien: mensaje verde y formulario limpio
        mostrarMensaje(`Producto ${datos.codigo} guardado.`, "exito");
        limpiarFormulario();
        // Vuelve a pedir la lista, para que la tabla muestre el cambio
        cargarProductos();
    } catch (error) {
        // La API no respondio
        mostrarMensaje("No se pudo conectar con la API.", "error");
    }
}

// editar: trae UN producto de la API (GET /:codigo) y lo pone en el formulario
async function editar(codigo) {
    // GET /api/productos/PR001: pide un solo producto
    const respuesta = await fetch(`${API}/${codigo}`);
    // p = el producto, ya convertido de JSON a objeto
    const p = await respuesta.json();
    // Pone cada dato del producto en su campo del formulario
    document.getElementById("codigo").value = p.codigo;
    // El codigo no se puede cambiar: es la llave primaria
    document.getElementById("codigo").disabled = true;
    document.getElementById("nombre").value = p.nombre;
    document.getElementById("stock").value = p.stock;
    document.getElementById("valorunitario").value = p.valorunitario;
    // Cambia el titulo, para que se note que se esta modificando
    document.getElementById("tituloFormulario").textContent = `Modificar producto ${p.codigo}`;
    // Recuerda cual se edita: asi guardar() sabe que debe usar PUT
    codigoEditando = p.codigo;
}

// eliminar: pide confirmacion y envia DELETE /:codigo
async function eliminar(codigo) {
    // confirm: ventana con Aceptar y Cancelar. Si cancela, no hace nada
    if (!confirm(`¿Eliminar el producto ${codigo}?`)) {
        return;
    }
    // fetch con method DELETE: borra el producto en la API
    const respuesta = await fetch(`${API}/${codigo}`, { method: "DELETE" });
    // 204 = borrado
    if (respuesta.status === 204) {
        mostrarMensaje(`Producto ${codigo} eliminado.`, "exito");
        // Vuelve a pedir la lista, para que la fila desaparezca
        cargarProductos();
    } else {
        // Cualquier otro codigo (por ejemplo 404): no se pudo
        mostrarMensaje("No se pudo eliminar el producto.", "error");
    }
}

// --- Al abrir la pagina ---
// Conecta el formulario con guardar, y el boton Cancelar con limpiarFormulario
document.getElementById("formulario").addEventListener("submit", guardar);
document.getElementById("cancelar").addEventListener("click", limpiarFormulario);
// Pide los productos a la API por primera vez
cargarProductos();
