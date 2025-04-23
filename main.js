// main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { insertarDatos } = require('./db');

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