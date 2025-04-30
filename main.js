// main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { insertarDatos, obtenerClientes, obtenerBebes, obtenerCajas, eliminarCliente,eliminarBebe } = require('./db');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('renderer.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('enviar-datos', async (event, datos) => {
  try {
    console.log('Datos recibidos en el proceso principal:', datos); // Verifica los datos recibidos
    const resultado = await insertarDatos(datos.cliente, datos.bebe, datos.caja);
    console.log('Resultado de insertarDatos:', resultado); // Verifica el resultado de la operación
    if (resultado.success) {
      return { success: true, message: 'Datos enviados correctamente.' };
    } else {
      return { success: false, message: 'Error al guardar los datos.', error: resultado.error };
    }
  } catch (error) {
    console.error('Error inesperado en enviar-datos:', error);
    return { success: false, message: 'Error inesperado.', error: error.message };
  }
});
ipcMain.handle('obtener-clientes', async () => {
  try {
    const clientes = await obtenerClientes(); // Llama a la función de la base de datos
    console.log('Clientes obtenidos:', clientes); // Verifica los datos obtenidos
    return { success: true, data: clientes };
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    return { success: false, message: 'Error al obtener los clientes.', error: error.message };
  }
});
ipcMain.handle('obtener-bebes', async () => {
  try {
    const bebes = await obtenerBebes(); // Llama a la función de la base de datos
    console.log('Bebés obtenidos:', bebes); // Verifica los datos obtenidos
    return { success: true, data: bebes };
  } catch (error) {
    console.error('Error al obtener los bebés:', error);
    return { success: false, message: 'Error al obtener los bebés.', error: error.message };
  }
});
ipcMain.handle('obtener-cajas', async () => {
  try {
    const cajas = await obtenerCajas(); // Llama a la función de la base de datos
    console.log('Cajas obtenidas:', cajas); // Verifica los datos obtenidos
    return { success: true, data: cajas };
  } catch (error) {
    console.error('Error al obtener las cajas:', error);
    return { success: false, message: 'Error al obtener las cajas.', error: error.message };
  }
});
ipcMain.handle('eliminar-cliente', async (event, clienteId) => {
  try {
    const resultado = await eliminarCliente(clienteId); // Llama a la función de la base de datos
    console.log('Cliente eliminado:', resultado);
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    return { success: false, message: 'Error al eliminar el cliente.', error: error.message };
  }
});
ipcMain.handle('eliminar-caja', async (event, numeroCaja) => {
  try {
    const resultado = await eliminarCaja(numeroCaja); // Llama a la función de la base de datos
    console.log('Caja eliminada:', resultado);
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar la caja:', error);
    return { success: false, message: 'Error al eliminar la caja.', error: error.message };
  }
});
ipcMain.handle('eliminar-bebe', async (event, bebeId) => {
  try {
    const resultado = await eliminarBebe(bebeId); // Llama a la función de la base de datos
    console.log('Bebé eliminado:', resultado);
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar el bebé:', error);
    return { success: false, message: 'Error al eliminar el bebé.', error: error.message };
  }
});