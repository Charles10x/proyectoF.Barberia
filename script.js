// 1. VALIDACIONES (Unidad 5)
//    Cada función lanza un error con throw si algo está mal
function validarNombre(nombre) {
    nombre = nombre.trim();
    if (nombre === "") {
        throw new Error("El nombre es obligatorio");
    }
    if (nombre.length < 3) {
        throw new Error("El nombre debe tener al menos 3 caracteres");
    }
    // solo letras y espacios (acepta tildes y ñ)
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(nombre)) {
        throw new Error("El nombre solo puede tener letras");
    }
}
function validarTelefono(telefono) {
    if (telefono === "") {
        throw new Error("El teléfono es obligatorio");
    }
    // 8 dígitos y empieza con 6 o 7
    if (!/^[67][0-9]{7}$/.test(telefono)) {
        throw new Error("El teléfono debe tener 8 dígitos y empezar con 6 o 7");
    }
}

function validarCorreo(correo) {
    // el correo es opcional, pero si lo escriben debe tener formato correcto
    if (correo !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        throw new Error("El correo no es válido");
    }
}

// 2. FUNCIONES PARA CADENAS (Unidad 2)
// "  juan PEREZ " -> "Juan Perez"
function formatearNombre(texto) {
    let palabras = texto.trim().toLowerCase().split(" ");
    let resultado = [];
    for (let i = 0; i < palabras.length; i++) {
        if (palabras[i] !== "") {
            resultado.push(palabras[i].charAt(0).toUpperCase() + palabras[i].slice(1));
        }
    }
    return resultado.join(" ");
}
// Quita tildes y pasa a minúsculas para buscar: "José" -> "jose"
function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
// 3. CLASES (Unidad 1 y 4)
// ----- Clase base ABSTRACTA -----
// No se puede crear con new Persona(), solo sirve para heredar
class Persona {
    // atributos privados (encapsulamiento)
    #nombre;
    #telefono;
    constructor(nombre, telefono) {
        if (new.target === Persona) {
            throw new Error("Persona es una clase abstracta, no se puede instanciar");
        }
        this.nombre = nombre;       
        this.telefono = telefono; 
    }
    // getters y setters (métodos de acceso)
    get nombre() {
        return this.#nombre;
    }
    set nombre(valor) {
        validarNombre(valor);
        this.#nombre = formatearNombre(valor);
    }
    get telefono() {
        return this.#telefono;
    }
    set telefono(valor) {
        validarTelefono(valor);
        this.#telefono = valor;
    }
    // método abstracto: las clases hijas DEBEN sobrescribirlo
    mostrarInformacion() {
        throw new Error("Este método debe implementarse en la clase hija");
    }
}
// Clase derivada 1: Cliente 
class Cliente extends Persona {
    #id;
    #correo;
    #esVip;

// miembro estático
    static ultimoId = 0;
    static siguienteId() {
        return Cliente.ultimoId + 1;
    }
// "Sobrecarga": correo y esVip son parámetros opcionales
    constructor(id, nombre, telefono, correo = "", esVip = false) {
        super(nombre, telefono);
        validarCorreo(correo);
        this.#id = id;
        this.#correo = correo;
        this.#esVip = esVip;
        if (id > Cliente.ultimoId) {
            Cliente.ultimoId = id;
        }
    }
    get id() { return this.#id; }
    get correo() { return this.#correo; }
    get esVip() { return this.#esVip; }
    // el cliente VIP tiene 15% de descuento
    obtenerDescuento() {
        if (this.#esVip) {
            return 0.15;
        }
        return 0;
    }
    // sobrescribe el método de Persona (polimorfismo)
    mostrarInformacion() {
        let tipo = this.#esVip ? "VIP" : "Normal";
        return this.nombre + " - " + this.telefono + " (" + tipo + ")";
    }
    // para poder guardar en JSON (los campos privados no se guardan solos)
    toJSON() {
        return {
            id: this.#id,
            nombre: this.nombre,
            telefono: this.telefono,
            correo: this.#correo,
            esVip: this.#esVip
        };
    }
}
//Clase derivada 2: Barbero
class Barbero extends Persona {
    constructor(nombre, telefono, especialidad = "Cortes") {
        super(nombre, telefono);
        this.especialidad = especialidad;
    }
// sobrescribe el método de Persona (polimorfismo)
    mostrarInformacion() {
        return this.nombre + " - " + this.telefono + " (" + this.especialidad + ")";
    }
}
// Servicio
class Servicio {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
// calcula el precio con descuento
    calcularTotal(descuento = 0) {
        return this.precio - this.precio * descuento;
    }
}
// Cita
class Cita {
    #estado;
    static ultimoId = 0;
    static siguienteId() {
        return Cita.ultimoId + 1;
    }
    constructor(id, clienteId, barbero, servicio, fecha, hora, total, notas = "", estado = "Pendiente") {
        this.id = id;
        this.clienteId = clienteId;
        this.barbero = barbero;
        this.servicio = servicio;
        this.fecha = fecha;
        this.hora = hora;
        this.total = total;
        this.notas = notas;
        this.estado = estado;
        if (id > Cita.ultimoId) {
            Cita.ultimoId = id;
        }
    }
    get estado() {
        return this.#estado;
    }
    set estado(valor) {
        if (valor !== "Pendiente" && valor !== "Completada" && valor !== "Cancelada") {
            throw new Error("Estado no válido");
        }
        this.#estado = valor;
    }
    toJSON() {
        return {
            id: this.id,
            clienteId: this.clienteId,
            barbero: this.barbero,
            servicio: this.servicio,
            fecha: this.fecha,
            hora: this.hora,
            total: this.total,
            notas: this.notas,
            estado: this.estado
        };
    }
}
// 4. DATOS (arreglos de objetos - Unidad 2)
let clientes = [];
let citas = [];
const barberos = [
    new Barbero("Luis Velasquez", "77371879", "Cortes clásicos"),
    new Barbero("Charles Cedeño", "74172238", "Fade y degradados"),
    new Barbero("Josep Cazas", "76611394", "Barba"),
    new Barbero("Oscar Perez", "75350290", "Mohicano y mullet")
];
const servicios = [
    new Servicio("Taper Fade", 50),
    new Servicio("High Fade", 55),
    new Servicio("Mid Fade", 50),
    new Servicio("Low Fade", 45),
    new Servicio("Mohicano", 60),
    new Servicio("Mullet", 55),
    new Servicio("Barba", 25),
    new Servicio("Tinte", 115)
];
// Imágenes y descripciones de los servicios
const vistasServicios = {
    "Taper Fade": {
        imagen: "imagenes/taper-fade.jpg",
        descripcion: "Degradado progresivo en los laterales."
    },

    "High Fade": {
        imagen: "imagenes/degradado.jpg",
        descripcion: "Degradado alto con laterales definidos."
    },

    "Mid Fade": {
        imagen: "imagenes/degradado.jpg",
        descripcion: "Degradado medio con acabado limpio."
    },

    "Low Fade": {
        imagen: "imagenes/degradado.jpg",
        descripcion: "Degradado bajo y discreto."
    },

    "Mohicano": {
        imagen: "imagenes/mohicano.jpg",
        descripcion: "Estilo mohicano con laterales cortos."
    },

    "Mullet": {
        imagen: "imagenes/mullet.jpg",
        descripcion: "Corte mullet con mayor longitud en la nuca."
    },

    "Barba": {
        imagen: "imagenes/barba.jpg",
        descripcion: "Referencia de arreglo y perfilado de barba."
    },

    "Tinte": {
        imagen: "imagenes/tinte.jpg",
        descripcion: "Referencia de coloración del cabello."
    }
};
// para saber si estamos editando (null = registrando uno nuevo)
let clienteEditando = null;
let citaEditando = null;
// 5. FUNCIONES AUXILIARES
function mostrarMensaje(texto, color) {
    let mensaje = document.getElementById("mensaje");
    mensaje.textContent = texto;
    mensaje.style.color = color;
}
function buscarClientePorId(id) {
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].id === id) {
            return clientes[i];
        }
    }
    return null;
}
function buscarServicio(nombre) {
    for (let i = 0; i < servicios.length; i++) {
        if (servicios[i].nombre === nombre) {
            return servicios[i];
        }
    }
    return null;
}
// Fecha de hoy en formato AAAA-MM-DD
function fechaHoy() {
    let hoy = new Date();
    let mes = String(hoy.getMonth() + 1).padStart(2, "0");
    let dia = String(hoy.getDate()).padStart(2, "0");
    return hoy.getFullYear() + "-" + mes + "-" + dia;
}
// "Sobrecarga" por verificación de argumentos:
// buscarClientes()          -> devuelve todos
// buscarClientes("texto")   -> busca por nombre o teléfono
// buscarClientes(5)         -> busca por ID (número)
function buscarClientes(criterio) {
    if (criterio === undefined || criterio === "") {
        return clientes;
    }
    if (typeof criterio === "number") {
        let encontrado = buscarClientePorId(criterio);
        return encontrado ? [encontrado] : [];
    }
    let texto = normalizar(criterio);
    let resultado = [];
    for (let i = 0; i < clientes.length; i++) {
        let c = clientes[i];
        if (normalizar(c.nombre).includes(texto) || c.telefono.includes(texto)) {
            resultado.push(c);
        }
    }
    return resultado;
}
// Operación de negocio: ¿el barbero está libre en esa fecha y hora?
function barberoLibre(barbero, fecha, hora, idIgnorar) {
    for (let i = 0; i < citas.length; i++) {
        let c = citas[i];
        if (c.id !== idIgnorar && c.barbero === barbero && c.fecha === fecha &&
            c.hora === hora && c.estado !== "Cancelada") {
            return false;
        }
    }
    return true;
}
// 6. GUARDAR Y RECUPERAR (Unidad 3)
// Guarda una copia automática en el navegador
function guardarEnNavegador() {
    let datos = { clientes: clientes, citas: citas };
    localStorage.setItem("peluqueria", JSON.stringify(datos));
}
// Convierte un texto JSON en objetos reales (Cliente y Cita)
function cargarDatos(texto) {
    let datos = JSON.parse(texto);   // si el JSON está mal, lanza error
    if (!Array.isArray(datos.clientes) || !Array.isArray(datos.citas)) {
        throw new Error("El archivo no tiene clientes y citas");
    }
    let nuevosClientes = [];
    let nuevasCitas = [];
    Cliente.ultimoId = 0;
    Cita.ultimoId = 0;
    for (let i = 0; i < datos.clientes.length; i++) {
        let d = datos.clientes[i];
        nuevosClientes.push(new Cliente(d.id, d.nombre, d.telefono, d.correo, d.esVip));
    }
    for (let i = 0; i < datos.citas.length; i++) {
        let d = datos.citas[i];
        nuevasCitas.push(new Cita(d.id, d.clienteId, d.barbero, d.servicio, d.fecha, d.hora, d.total, d.notas, d.estado));
    }
    clientes = nuevosClientes;
    citas = nuevasCitas;
}
function exportarJSON() {
    let datos = { clientes: clientes, citas: citas };
    descargar("peluqueria.json", JSON.stringify(datos, null, 2), "application/json");
}
// INNOVACIÓN: reporte en CSV (se abre con Excel)
function exportarCSV() {
    let texto = "ID,Cliente,Barbero,Servicio,Fecha,Hora,Total,Estado\n";
    for (let i = 0; i < citas.length; i++) {
        let c = citas[i];
        let cliente = buscarClientePorId(c.clienteId);
        let nombre = cliente ? cliente.nombre : "(eliminado)";
        texto += c.id + "," + nombre + "," + c.barbero + "," + c.servicio + "," +
                 c.fecha + "," + c.hora + "," + c.total + "," + c.estado + "\n";
    }
    descargar("reporte_citas.csv", "﻿" + texto, "text/csv");
}
// Crea un archivo y lo descarga
function descargar(nombreArchivo, contenido, tipo) {
    let blob = new Blob([contenido], { type: tipo });
    let enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = nombreArchivo;
    enlace.click();
}
// INNOVACIÓN: leer un archivo con FileReader
function importarJSON(evento) {
    let archivo = evento.target.files[0];
    if (!archivo) {
        return;
    }
    let lector = new FileReader();
    lector.onload = function () {
        try {
            cargarDatos(lector.result);
            guardarEnNavegador();
            mostrarMensaje("Datos importados correctamente", "green");
        } catch (error) {
            mostrarMensaje("Error al importar: " + error.message, "red");
        } finally {
            pintarTodo();
        }
    };
    lector.readAsText(archivo);
    evento.target.value = "";
}
// 7. PANTALLA: BARBEROS
function pintarBarberos() {
    let tbody = document.getElementById("listaBarberos");
    tbody.innerHTML = "";
    for (let i = 0; i < barberos.length; i++) {
        let fila = document.createElement("tr");
        let b = barberos[i];
        let tdNombre = document.createElement("td");
        tdNombre.textContent = b.nombre;
        let tdTel = document.createElement("td");
        tdTel.textContent = b.telefono;
        let tdEsp = document.createElement("td");
        tdEsp.textContent = b.especialidad;

        fila.appendChild(tdNombre);
        fila.appendChild(tdTel);
        fila.appendChild(tdEsp);
        tbody.appendChild(fila);
    }
}
// 8. PANTALLA: CLIENTES
function crearBoton(texto, clase, funcion) {
    let boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = texto;
    boton.className = "chico " + clase;
    boton.onclick = funcion;
    return boton;
}
function pintarClientes() {
    let tbody = document.getElementById("listaClientes");
    tbody.innerHTML = "";
    let texto = document.getElementById("buscarCliente").value;
    let lista = buscarClientes(texto);
    for (let i = 0; i < lista.length; i++) {
        let c = lista[i];
        let fila = document.createElement("tr");
        let datos = [c.id, c.nombre, c.telefono, c.esVip ? "VIP" : "Normal"];
        for (let j = 0; j < datos.length; j++) {
            let td = document.createElement("td");
            td.textContent = datos[j];
            fila.appendChild(td);
        }
        let tdAcciones = document.createElement("td");
        tdAcciones.appendChild(crearBoton("Editar", "gris", function () { editarCliente(c.id); }));
        tdAcciones.appendChild(crearBoton("Eliminar", "rojo", function () { eliminarCliente(c.id); }));
        fila.appendChild(tdAcciones);
        tbody.appendChild(fila);
    }
}
function guardarCliente(evento) {
    evento.preventDefault();   // evita que la página se recargue
    let nombre = document.getElementById("nombre").value;
    let telefono = document.getElementById("telefono").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let esVip = document.getElementById("tipo").value === "vip";
    try {
        // no permitir teléfonos repetidos
        for (let i = 0; i < clientes.length; i++) {
            if (clientes[i].telefono === telefono && clientes[i].id !== clienteEditando) {
                throw new Error("Ya existe un cliente con ese teléfono");
            }
        }
        if (clienteEditando === null) {
            // REGISTRAR
            let nuevo = new Cliente(Cliente.siguienteId(), nombre, telefono, correo, esVip);
            clientes.push(nuevo);
            mostrarMensaje("Cliente registrado correctamente", "green");
        } else {
        // MODIFICAR: se reemplaza el objeto en la misma posición
            for (let i = 0; i < clientes.length; i++) {
                if (clientes[i].id === clienteEditando) {
                    clientes[i] = new Cliente(clienteEditando, nombre, telefono, correo, esVip);
                }
            }
            mostrarMensaje("Cliente modificado correctamente", "green");
        }
        cancelarCliente();
    } catch (error) {
        mostrarMensaje(error.message, "red");
    } finally {
        guardarEnNavegador();   // se ejecuta siempre
        pintarTodo();
    }
}
function editarCliente(id) {
    let c = buscarClientePorId(id);
    clienteEditando = id;
    document.getElementById("nombre").value = c.nombre;
    document.getElementById("telefono").value = c.telefono;
    document.getElementById("correo").value = c.correo;
    document.getElementById("tipo").value = c.esVip ? "vip" : "normal";
    document.getElementById("tituloCliente").textContent = "Modificar cliente";
    document.getElementById("btnCliente").textContent = "Guardar cambios";
    document.getElementById("btnCancelarCliente").hidden = false;
}
function cancelarCliente() {
    clienteEditando = null;
    document.getElementById("formCliente").reset();
    document.getElementById("tituloCliente").textContent = "Registrar cliente";
    document.getElementById("btnCliente").textContent = "Registrar cliente";
    document.getElementById("btnCancelarCliente").hidden = true;
    document.getElementById("errorNombre").textContent = "";
    document.getElementById("errorTelefono").textContent = "";
    document.getElementById("errorCorreo").textContent = "";
}
function eliminarCliente(id) {
    // no se puede borrar un cliente que tiene citas
    for (let i = 0; i < citas.length; i++) {
        if (citas[i].clienteId === id) {
            mostrarMensaje("No se puede eliminar: el cliente tiene citas", "red");
            return;
        }
    }
    if (confirm("¿Eliminar este cliente?")) {
        clientes = clientes.filter(function (c) {
            return c.id !== id;
        });
        guardarEnNavegador();
        pintarTodo();
        mostrarMensaje("Cliente eliminado", "green");
    }
}
// Validación en vivo: muestra el error debajo del campo
function validarEnVivo(idCampo, idError, funcionValidar) {
    let valor = document.getElementById(idCampo).value;
    try {
        funcionValidar(valor);
        document.getElementById(idError).textContent = "";
    } catch (error) {
        document.getElementById(idError).textContent = error.message;
    }
}
// 9. PANTALLA: CITAS
function llenarSelects() {
    // Clientes
    let selCliente = document.getElementById("citaCliente");
    let clienteActual = selCliente.value;
    selCliente.innerHTML = "<option value=''>Elige un cliente</option>";
    for (let i = 0; i < clientes.length; i++) {
        let op = document.createElement("option");
        op.value = clientes[i].id;
        op.textContent = clientes[i].nombre;
        selCliente.appendChild(op);
    }
    selCliente.value = clienteActual;
    // Barberos
    let selBarbero = document.getElementById("citaBarbero");
    if (selBarbero.options.length === 0) {
        selBarbero.innerHTML = "<option value=''>Elige un barbero</option>";
        for (let i = 0; i < barberos.length; i++) {
            let op = document.createElement("option");
            op.value = barberos[i].nombre;
            op.textContent = barberos[i].nombre;
            selBarbero.appendChild(op);
        }
    }
    // Servicios
    let selServicio = document.getElementById("citaServicio");
    if (selServicio.options.length === 0) {
        selServicio.innerHTML = "<option value=''>Elige un servicio</option>";
        for (let i = 0; i < servicios.length; i++) {
            let op = document.createElement("option");
            op.value = servicios[i].nombre;
            op.textContent = servicios[i].nombre + " - Bs " + servicios[i].precio;
            selServicio.appendChild(op);
        }
    }
}
// Muestra solo las horas libres del barbero en la fecha elegida
function llenarHoras(horaSeleccionada) {
    let selHora = document.getElementById("citaHora");
    let barbero = document.getElementById("citaBarbero").value;
    let fecha = document.getElementById("citaFecha").value;
    selHora.innerHTML = "";
    if (barbero === "" || fecha === "") {
        selHora.innerHTML = "<option value=''>Elige barbero y fecha</option>";
        return;
    }
    selHora.innerHTML = "<option value=''>Elige una hora</option>";
    // horario de atención: 9:00 a 23:00 (la última cita es a las 22:00)
    for (let h = 9; h <= 22; h++) {
        let hora = String(h).padStart(2, "0") + ":00";
        if (barberoLibre(barbero, fecha, hora, citaEditando)) {
            let op = document.createElement("option");
            op.value = hora;
            op.textContent = hora;
            selHora.appendChild(op);
        }
    }
    if (horaSeleccionada) {
        selHora.value = horaSeleccionada;
    }
}
// Calcula y muestra el total
function mostrarTotal() {
    let cliente = buscarClientePorId(Number(document.getElementById("citaCliente").value));
    let servicio = buscarServicio(document.getElementById("citaServicio").value);
    let texto = document.getElementById("resumenPrecio");
    if (cliente && servicio) {
        let total = servicio.calcularTotal(cliente.obtenerDescuento());
        texto.textContent = "Total: Bs " + total.toFixed(2);
    } else {
        texto.textContent = "Total: Bs 0";
    }
}
// Actualiza la imagen según el servicio seleccionado
function actualizarVistaServicio() {
    let nombre = document.getElementById("citaServicio").value;

    let imagen = document.getElementById("imagenServicio");
    let titulo = document.getElementById("nombreServicioImagen");

    let vista = vistasServicios[nombre];

    if (!vista) {
        imagen.src = "imagenes/barberia.jpg";
        imagen.alt = "Imagen de la barbería";

        titulo.textContent = "Elige un servicio";

        return;
    }

    imagen.src = vista.imagen;
    imagen.alt = "Imagen de referencia: " + nombre;

    titulo.textContent = nombre;
}
function guardarCita(evento) {
    evento.preventDefault();
    let clienteId = Number(document.getElementById("citaCliente").value);
    let barbero = document.getElementById("citaBarbero").value;
    let nombreServicio = document.getElementById("citaServicio").value;
    let fecha = document.getElementById("citaFecha").value;
    let hora = document.getElementById("citaHora").value;
    let notas = document.getElementById("citaNotas").value.trim();
    try {
        let cliente = buscarClientePorId(clienteId);
        let servicio = buscarServicio(nombreServicio);
        if (!cliente) {
            throw new Error("Elige un cliente");
        }
        if (!servicio) {
            throw new Error("Elige un servicio");
        }
        if (fecha < fechaHoy()) {
            throw new Error("No se puede reservar en una fecha pasada");
        }
        if (hora === "") {
            throw new Error("Elige una hora");
        }
        if (!barberoLibre(barbero, fecha, hora, citaEditando)) {
            throw new Error("Ese barbero ya tiene una cita a esa hora");
        }
        let total = servicio.calcularTotal(cliente.obtenerDescuento());
        if (citaEditando === null) {
        // REGISTRAR
            let nueva = new Cita(Cita.siguienteId(), clienteId, barbero, nombreServicio, fecha, hora, total, notas);
            citas.push(nueva);
            mostrarMensaje("Cita reservada. Total: Bs " + total.toFixed(2), "green");
        } else {
        // MODIFICAR
            for (let i = 0; i < citas.length; i++) {
                if (citas[i].id === citaEditando) {
                    citas[i] = new Cita(citaEditando, clienteId, barbero, nombreServicio, fecha, hora, total, notas, citas[i].estado);
                }
            }
            mostrarMensaje("Cita modificada correctamente", "green");
        }
        cancelarCita();
    } catch (error) {
        mostrarMensaje(error.message, "red");
    } finally {
        guardarEnNavegador();
        pintarTodo();
    }
}
function pintarCitas() {
    let tbody = document.getElementById("listaCitas");
    tbody.innerHTML = "";
    let texto = normalizar(document.getElementById("buscarCita").value);
    let estado = document.getElementById("filtroEstado").value;
    let cobrado = 0;
    let mostradas = 0;
    for (let i = 0; i < citas.length; i++) {
        let c = citas[i];
        let cliente = buscarClientePorId(c.clienteId);
        let nombreCliente = cliente ? cliente.nombre : "(eliminado)";
        // filtros combinados: texto + estado
        let coincideTexto = normalizar(nombreCliente + " " + c.barbero + " " + c.servicio).includes(texto);
        let coincideEstado = estado === "" || c.estado === estado;
        if (!coincideTexto || !coincideEstado) {
            continue;
        }
        mostradas++;
        if (c.estado === "Completada") {
            cobrado += c.total;
        }
        let fila = document.createElement("tr");
        let datos = [c.id, nombreCliente, c.barbero, c.servicio, c.fecha, c.hora, "Bs " + c.total.toFixed(2)];
        for (let j = 0; j < datos.length; j++) {
            let td = document.createElement("td");
            td.textContent = datos[j];
            fila.appendChild(td);
        }
        let tdEstado = document.createElement("td");
        tdEstado.textContent = c.estado;
        tdEstado.className = c.estado.toLowerCase();
        fila.appendChild(tdEstado);
        let tdAcciones = document.createElement("td");
        if (c.estado === "Pendiente") {
            tdAcciones.appendChild(crearBoton("Completar", "", function () { cambiarEstado(c.id, "Completada"); }));
            tdAcciones.appendChild(crearBoton("Cancelar", "gris", function () { cambiarEstado(c.id, "Cancelada"); }));
            tdAcciones.appendChild(crearBoton("Editar", "gris", function () { editarCita(c.id); }));
        }
        tdAcciones.appendChild(crearBoton("Eliminar", "rojo", function () { eliminarCita(c.id); }));
        fila.appendChild(tdAcciones);

        tbody.appendChild(fila);
    }
    document.getElementById("ingresos").textContent =
        "Citas mostradas: " + mostradas + " | Ingresos cobrados (completadas): Bs " + cobrado.toFixed(2);
}
function cambiarEstado(id, nuevoEstado) {
    for (let i = 0; i < citas.length; i++) {
        if (citas[i].id === id) {
            citas[i].estado = nuevoEstado;
        }
    }
    guardarEnNavegador();
    pintarTodo();
    mostrarMensaje("Cita " + nuevoEstado.toLowerCase(), "green");
}
function editarCita(id) {
    let c = null;
    for (let i = 0; i < citas.length; i++) {
        if (citas[i].id === id) {
            c = citas[i];
        }
    }
    citaEditando = id;
    document.getElementById("citaCliente").value = c.clienteId;
    document.getElementById("citaBarbero").value = c.barbero;
    document.getElementById("citaServicio").value = c.servicio;
    document.getElementById("citaFecha").value = c.fecha;
    llenarHoras(c.hora);
    document.getElementById("citaNotas").value = c.notas;
    mostrarTotal();
    actualizarVistaServicio();
    document.getElementById("tituloCita").textContent = "Modificar cita";
    document.getElementById("btnCita").textContent = "Guardar cambios";
    document.getElementById("btnCancelarCita").hidden = false;
}
function cancelarCita() {
    citaEditando = null;
    document.getElementById("formCita").reset();
    llenarHoras();
    mostrarTotal();
    actualizarVistaServicio();
    document.getElementById("tituloCita").textContent = "Reservar cita";
    document.getElementById("btnCita").textContent = "Reservar cita";
    document.getElementById("btnCancelarCita").hidden = true;
}
function eliminarCita(id) {
    if (confirm("¿Eliminar esta cita?")) {
        citas = citas.filter(function (c) {
            return c.id !== id;
        });
        guardarEnNavegador();
        pintarTodo();
        mostrarMensaje("Cita eliminada", "green");
    }
}
// 10. INICIO DE LA PÁGINA
function pintarTodo() {
    llenarSelects();
    pintarClientes();
    pintarCitas();
    llenarHoras(document.getElementById("citaHora").value);
    mostrarTotal();
    actualizarVistaServicio();
}
// Al cargar la página: recuperar datos guardados y conectar los eventos
window.onload = function () {
    try {
        let guardado = localStorage.getItem("peluqueria");
        if (guardado) {
            cargarDatos(guardado);
        }
    } catch (error) {
        console.log("No se pudieron recuperar los datos: " + error.message);
    }
    // no se puede elegir una fecha pasada
    document.getElementById("citaFecha").min = fechaHoy();
    pintarBarberos();
    pintarTodo();
    // --- Eventos de clientes ---
    document.getElementById("formCliente").addEventListener("submit", guardarCliente);
    document.getElementById("btnCancelarCliente").onclick = cancelarCliente;
    document.getElementById("buscarCliente").addEventListener("input", pintarClientes);
    // evento input: validar mientras escribe
    document.getElementById("nombre").addEventListener("input", function () {
        validarEnVivo("nombre", "errorNombre", validarNombre);
    });
    document.getElementById("telefono").addEventListener("input", function () {
    // deja solo números
        this.value = this.value.replace(/[^0-9]/g, "");
        validarEnVivo("telefono", "errorTelefono", validarTelefono);
    });
    // evento blur: validar cuando el campo pierde el foco
    document.getElementById("correo").addEventListener("blur", function () {
        validarEnVivo("correo", "errorCorreo", validarCorreo);
    });
    // --- Eventos de citas ---
    document.getElementById("formCita").addEventListener("submit", guardarCita);
    document.getElementById("btnCancelarCita").onclick = cancelarCita;
    document.getElementById("citaBarbero").addEventListener("change", function () { llenarHoras(); });
    document.getElementById("citaFecha").addEventListener("change", function () { llenarHoras(); });
    document.getElementById("citaCliente").addEventListener("change", mostrarTotal);
    document.getElementById("citaServicio").addEventListener("change", function () {
    mostrarTotal();
    actualizarVistaServicio();
});
    document.getElementById("buscarCita").addEventListener("input", pintarCitas);
    document.getElementById("filtroEstado").addEventListener("change", pintarCitas);
    // --- Eventos de archivos ---
    document.getElementById("btnExportar").onclick = exportarJSON;
    document.getElementById("btnCSV").onclick = exportarCSV;
    document.getElementById("archivoImportar").addEventListener("change", importarJSON);
};