class Cita {
    constructor(id, fecha, nombre, apellidos, dni, telefono, nacimiento, observaciones) {
        this.id = id; 
        this.fecha = fecha;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.dni = dni;
        this.telefono = telefono;
        this.nacimiento = nacimiento;
        this.observaciones = observaciones;
    }
}

// Variables
let citas = JSON.parse(localStorage.getItem('citas')) || [];
let indiceEdicion = null;

const modalForm = document.getElementById('modal-formulario');
const modalTabla = document.getElementById('modal-tabla');
const form = document.getElementById('formulario-cita');
const errorTexto = document.getElementById('mensaje-error');

// Botones y formulario
document.getElementById('btn-abrir-formulario').onclick = () => {
    form.reset();
    indiceEdicion = null;
    errorTexto.textContent = '';
    document.getElementById('titulo-formulario').textContent = 'Añadir Nueva Cita';
    modalForm.showModal();
};

document.getElementById('btn-abrir-tabla').onclick = () => {
    mostrarTabla();
    modalTabla.showModal();
};

document.getElementById('btn-cerrar-formulario').onclick = () => modalForm.close();
document.getElementById('btn-cerrar-tabla').onclick = () => modalTabla.close();

// Validación de datos
function validar(fecha, nombre, apellidos, dni, telefono, nacimiento) {
    if (!fecha || !nombre || !apellidos || !dni || !telefono || !nacimiento) {
        errorTexto.textContent = 'Rellena todos los campos obligatorios.';
        return false;
    }
    if (!/^[0-9]{8}[A-Za-z]$/.test(dni)) {
        errorTexto.textContent = 'El DNI debe tener 8 números y 1 letra.';
        return false;
    }
    if (!/^[0-9]{9}$/.test(telefono)) {
        errorTexto.textContent = 'El teléfono debe contener exactamente 9 números.';
        return false;
    }
    if (fecha <= nacimiento) {
        errorTexto.textContent = 'La cita debe ser posterior al nacimiento.';
        return false;
    }
    errorTexto.textContent = '';
    return true;
}

// Objeto
form.onsubmit = (e) => {
    e.preventDefault();

    const fecha = document.getElementById('fecha-cita').value;
    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const dni = document.getElementById('dni').value.trim().toUpperCase();
    const telefono = document.getElementById('telefono').value.trim();
    const nacimiento = document.getElementById('fecha-nacimiento').value;
    const observaciones = document.getElementById('observaciones').value.trim();

    if (!validar(fecha, nombre, apellidos, dni, telefono, nacimiento)) {
        return;
    }

    // Crear o modificar cita
    const id = (indiceEdicion === null) ? Date.now() : citas[indiceEdicion].id;

    // Crear objeto
    const nuevaCita = new Cita(id, fecha, nombre, apellidos, dni, telefono, nacimiento, observaciones);

    if (indiceEdicion === null) {
        citas.push(nuevaCita);
    } else {
        citas[indiceEdicion] = nuevaCita;
    }

    localStorage.setItem('citas', JSON.stringify(citas));
    modalForm.close();
};

// Mostrar la tabla
function mostrarTabla() {
    const tbody = document.getElementById('cuerpo-tabla-citas');
    tbody.innerHTML = '';

    citas.forEach((c, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${c.fecha}</td>
                <td>${c.nombre} ${c.apellidos}</td>
                <td>${c.dni}</td>
                <td>${c.telefono}</td>
                <td>${c.nacimiento}</td>
                <td>${c.observaciones || '-'}</td>
                <td>
                    <button type="button" onclick="editarCita(${i})">Modificar</button>
                    <button type="button" onclick="borrarCita(${i})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// Editar y borrar citas
function editarCita(i) {
    indiceEdicion = i;
    const c = citas[i];

    document.getElementById('fecha-cita').value = c.fecha;
    document.getElementById('nombre').value = c.nombre;
    document.getElementById('apellidos').value = c.apellidos;
    document.getElementById('dni').value = c.dni;
    document.getElementById('telefono').value = c.telefono;
    document.getElementById('fecha-nacimiento').value = c.nacimiento;
    document.getElementById('observaciones').value = c.observaciones;

    errorTexto.textContent = '';
    document.getElementById('titulo-formulario').textContent = 'Modificar Cita';
    modalTabla.close();
    modalForm.showModal();
}

function borrarCita(i) {
    citas.splice(i, 1);
    localStorage.setItem('citas', JSON.stringify(citas));
    mostrarTabla();
}