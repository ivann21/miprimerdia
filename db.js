// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'miprimerdia'
});

async function insertarDatos(cliente, bebe, caja) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insertar cliente
    const [clienteRes] = await connection.execute(
      `INSERT INTO Clientes (nombre_apellidos, email, telefono, direccion)
       VALUES (?, ?, ?, ?)`,
      [cliente.nombre_apellidos, cliente.email, cliente.telefono, cliente.direccion]
    );
    const clienteId = clienteRes.insertId;

    // Insertar servicio (usamos tipo 1 para "Caja")
    const [servicioRes] = await connection.execute(
      `INSERT INTO Servicios (id_cliente, id_tipo_servicio)
       VALUES (?, ?)`,
      [clienteId, 1]
    );
    const servicioId = servicioRes.insertId;

    // Insertar bebé
    const [bebeRes] = await connection.execute(
      `INSERT INTO Bebes (nombre, apellidos, fecha_nacimiento, direccion_familiar, ciudad_familiar, nombre_padre, nombre_madre)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [bebe.nombre, bebe.apellidos, bebe.fecha_nacimiento, bebe.direccion_familiar, bebe.ciudad_familiar, bebe.nombre_padre, bebe.nombre_madre]
    );
    const bebeId = bebeRes.insertId;

    // Insertar caja
    await connection.execute(
      `INSERT INTO Cajas (id_servicio, id_tipo_caja, id_bebe, numero_caja, precio_final)
       VALUES (?, ?, ?, ?, ?)`,
      [servicioId, caja.id_tipo_caja, bebeId, caja.numero_caja, caja.precio_final]
    );

    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    return { success: false, error: error.message };
  } finally {
    connection.release();
  }
}

module.exports = { insertarDatos };
