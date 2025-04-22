// renderer.js
const { ipcRenderer } = window.require('electron');

document.getElementById('formulario').addEventListener('submit', async (e) => {
  e.preventDefault();

  const cliente = {
    nombre_apellidos: document.getElementById('cliente_nombre').value.trim(),
    email: document.getElementById('cliente_email').value.trim(),
    telefono: document.getElementById('cliente_telefono').value.trim(),
    direccion: document.getElementById('cliente_direccion').value.trim()
  };

  const bebe = {
    nombre: document.getElementById('bebe_nombre').value.trim(),
    apellidos: document.getElementById('bebe_apellidos').value.trim(),
    fecha_nacimiento: document.getElementById('bebe_fecha_nacimiento').value,
    direccion_familiar: document.getElementById('bebe_direccion').value.trim(),
    ciudad_familiar: document.getElementById('bebe_ciudad').value.trim(),
    nombre_padre: document.getElementById('padre_nombre').value.trim(),
    nombre_madre: document.getElementById('madre_nombre').value.trim()
  };

  const caja = {
    numero_caja: document.getElementById('caja_numero').value.trim(),
    precio_final: parseFloat(document.getElementById('caja_precio').value),
    id_tipo_caja: parseInt(document.getElementById('caja_tipo').value) // puede ser 1, 2 o 3
  };

  // Validación
  if (!cliente.nombre_apellidos || (!cliente.telefono && !cliente.email)) {
    alert('Debe completar el nombre del cliente y al menos un medio de contacto.');
    return;
  }

  if (!bebe.nombre || !bebe.apellidos || !bebe.fecha_nacimiento) {
    alert('Debe completar el nombre, apellidos y fecha de nacimiento del bebé.');
    return;
  }

  if (!caja.numero_caja || isNaN(caja.precio_final)) {
    alert('Debe indicar el número de la caja y su precio.');
    return;
  }

  const resultado = await ipcRenderer.invoke('enviar-datos', { cliente, bebe, caja });

  if (resultado.success) {
    alert('Datos guardados con éxito.');
    document.getElementById('formulario').reset();
  } else {
    alert('Error al guardar los datos: ' + resultado.error);
  }
});
