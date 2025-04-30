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
  async function obtenerClientes() {
    const connection = await pool.getConnection();
    try {
      const query = `
        SELECT 
          id,
          nombre_apellidos,
          email,
          telefono,
          direccion,
          codigo_postal,
          ciudad,
          fecha_nacimiento,
          fecha_de_alta,
          fecha_ultima_contratacion
        FROM Clientes
      `;
      const [rows] = await connection.execute(query);
      return rows; // Devuelve los datos de los clientes
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
  async function obtenerCajas() {
    const connection = await pool.getConnection();
    try {
      const query = `
        SELECT 
          Cajas.numero_caja, 
          TiposCaja.nombre AS tipo_caja, 
          Cajas.precio_final, 
          Cajas.estado, 
          Cajas.fecha_entrega
        FROM Cajas
        INNER JOIN TiposCaja ON Cajas.id_tipo_caja = TiposCaja.id
      `;
      const [rows] = await connection.execute(query);
      return rows; // Devuelve los datos de las cajas
    } catch (error) {
      console.error('Error al obtener las cajas:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
  
  async function obtenerBebes() {
    const connection = await pool.getConnection();
    try {
      const query = `
        SELECT 
          id,
          nombre,
          apellidos,
          fecha_nacimiento,
          lugar_nacimiento,
          genero,
          direccion_familiar,
          codigo_postal_familiar,
          ciudad_familiar,
          telefono_contacto,
          email_contacto,
          nombre_padre,
          apellidos_padre,
          fecha_nacimiento_padre,
          nombre_madre,
          apellidos_madre,
          fecha_nacimiento_madre
        FROM Bebes
      `;
      const [rows] = await connection.execute(query);
      return rows; // Devuelve los datos de los bebés
    } catch (error) {
      console.error('Error al obtener los bebés:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
  
  async function eliminarCliente(clienteId) {
    const connection = await pool.getConnection();
    try {
      const query = `DELETE FROM Clientes WHERE id = ?`;
      await connection.execute(query, [clienteId]);
      console.log(`Cliente con ID ${clienteId} eliminado.`);
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
  async function eliminarCaja(numeroCaja) {
    const connection = await pool.getConnection();
    try {
      const query = `DELETE FROM Cajas WHERE numero_caja = ?`;
      await connection.execute(query, [numeroCaja]);
      console.log(`Caja con número ${numeroCaja} eliminada.`);
    } catch (error) {
      console.error('Error al eliminar la caja:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
  async function eliminarBebe(bebeId) {
    const connection = await pool.getConnection();
    try {
      const query = `DELETE FROM Bebes WHERE id = ?`;
      await connection.execute(query, [bebeId]);
      console.log(`Bebé con ID ${bebeId} eliminado.`);
    } catch (error) {
      console.error('Error al eliminar el bebé:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
  
  module.exports = { insertarDatos, obtenerClientes, obtenerBebes, obtenerCajas, eliminarCliente, eliminarCaja, eliminarBebe };