// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '192.168.1.152',
  user: 'admin',
  password: '1234',
  database: 'miprimerdia'
});
pool.getConnection()
  .then(() => console.log('Conexión a la base de datos exitosa.'))
  .catch((error) => console.error('Error al conectar a la base de datos:', error));


  async function insertarDatos(cliente, bebe, caja) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      console.log('Iniciando transacción...');
  
      // Insertar cliente
      const [clienteRes] = await connection.execute(
        `INSERT INTO Clientes (nombre_apellidos, email, telefono, direccion)
         VALUES (?, ?, ?, ?)`,
        [cliente.nombre_apellidos, cliente.email, cliente.telefono, cliente.direccion]
      );
      const clienteId = clienteRes.insertId;
      console.log('Cliente insertado con ID:', clienteId);
  
      // Insertar servicio
      const [servicioRes] = await connection.execute(
        `INSERT INTO Servicios (id_cliente, id_tipo_servicio)
         VALUES (?, ?)`,
        [clienteId, 1]
      );
      const servicioId = servicioRes.insertId;
      console.log('Servicio insertado con ID:', servicioId);
  
      // Insertar bebé
      const [bebeRes] = await connection.execute(
        `INSERT INTO Bebes (nombre, apellidos, fecha_nacimiento, direccion_familiar, ciudad_familiar, nombre_padre, nombre_madre)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [bebe.nombre, bebe.apellidos, bebe.fecha_nacimiento, bebe.direccion_familiar, bebe.ciudad_familiar, bebe.nombre_padre, bebe.nombre_madre]
      );
      const bebeId = bebeRes.insertId;
      console.log('Bebé insertado con ID:', bebeId);
  
      // Insertar caja
      await connection.execute(
        `INSERT INTO Cajas (id_servicio, id_tipo_caja, id_bebe, numero_caja, precio_final)
         VALUES (?, ?, ?, ?, ?)`,
        [servicioId, caja.id_tipo_caja, bebeId, caja.numero_caja, caja.precio_final]
      );
      console.log('Caja insertada.');
  
      await connection.commit();
      console.log('Transacción completada.');
      return { success: true };
    } catch (error) {
      console.error('Error en insertarDatos:', error);
      await connection.rollback();
      return { success: false, error: error.message };
    } finally {
      connection.release();
    }
  }

module.exports = { insertarDatos };
