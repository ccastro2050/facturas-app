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
// tipo = "exito" (verde) o "error" (rojo): es la clase de CSS
function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById("mensaje");
    mensaje.textContent = texto;
    mensaje.className = "mensaje " + tipo;
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
        // map: convierte cada producto en una fila <tr> de texto HTML; join(""): las pega todas
        document.getElementById("filas").innerHTML = productos.map((p) => `
            <tr>
                <td>${p.codigo}</td>
                <td>${p.nombre}</td>
                <td>${p.stock}</td>
                <td>${pesos(p.valorunitario)}</td>
                <td>${pesos(p.valorinventario)}</td>
                <td>
                    <button onclick="editar('${p.codigo}')" class="secundario">Editar</button>
                    <button onclick="eliminar('${p.codigo}')" class="peligro">Eliminar</button>
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
    return {
        codigo: document.getElementById("codigo").value,
        nombre: document.getElementById("nombre").value,
        stock: Number(document.getElementById("stock").value),
        valorunitario: Number(document.getElementById("valorunitario").value)
    };
}

// limpiarFormulario: borra los campos y vuelve al modo "nuevo producto"
function limpiarFormulario() {
    document.getElementById("formulario").reset();
    document.getElementById("codigo").disabled = false;
    document.getElementById("tituloFormulario").textContent = "Nuevo producto";
    codigoEditando = null;
}

// guardar: se ejecuta al enviar el formulario. POST si es nuevo, PUT si se esta editando
async function guardar(evento) {
    // preventDefault: evita que el navegador recargue la pagina al enviar el formulario
    evento.preventDefault();
    // condicion ? si : no -> la URL y el metodo dependen de si se esta editando
    const url = codigoEditando ? `${API}/${codigoEditando}` : API;
    const metodo = codigoEditando ? "PUT" : "POST";
    try {
        const respuesta = await fetch(url, {
            method: metodo,                                    // POST o PUT
            headers: { "Content-Type": "application/json" },   // le dice a la API que va JSON
            body: JSON.stringify(leerFormulario())              // el objeto convertido en texto JSON
        });
        const datos = await respuesta.json();
        // respuesta.ok = true si el codigo es 2xx (200, 201)
        if (!respuesta.ok) {
            // 400 o 404: la API explica que esta mal. join(" "): une la lista de errores
            mostrarMensaje(datos.errores ? datos.errores.join(" ") : datos.error, "error");
            return;
        }
        mostrarMensaje(`Producto ${datos.codigo} guardado.`, "exito");
        limpiarFormulario();
        // Vuelve a pedir la lista, para que la tabla muestre el cambio
        cargarProductos();
    } catch (error) {
        mostrarMensaje("No se pudo conectar con la API.", "error");
    }
}

// editar: trae UN producto de la API (GET /:codigo) y lo pone en el formulario
async function editar(codigo) {
    const respuesta = await fetch(`${API}/${codigo}`);
    const p = await respuesta.json();
    document.getElementById("codigo").value = p.codigo;
    // El codigo no se puede cambiar: es la llave primaria
    document.getElementById("codigo").disabled = true;
    document.getElementById("nombre").value = p.nombre;
    document.getElementById("stock").value = p.stock;
    document.getElementById("valorunitario").value = p.valorunitario;
    document.getElementById("tituloFormulario").textContent = `Modificar producto ${p.codigo}`;
    codigoEditando = p.codigo;
}

// eliminar: pide confirmacion y envia DELETE /:codigo
async function eliminar(codigo) {
    // confirm: ventana con Aceptar y Cancelar. Si cancela, no hace nada
    if (!confirm(`¿Eliminar el producto ${codigo}?`)) {
        return;
    }
    const respuesta = await fetch(`${API}/${codigo}`, { method: "DELETE" });
    // 204 = borrado
    if (respuesta.status === 204) {
        mostrarMensaje(`Producto ${codigo} eliminado.`, "exito");
        cargarProductos();
    } else {
        mostrarMensaje("No se pudo eliminar el producto.", "error");
    }
}

// --- Al abrir la pagina ---
// Conecta el formulario con guardar, y el boton Cancelar con limpiarFormulario
document.getElementById("formulario").addEventListener("submit", guardar);
document.getElementById("cancelar").addEventListener("click", limpiarFormulario);
// Pide los productos a la API por primera vez
cargarProductos();
