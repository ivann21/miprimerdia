const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  enviarDatos: (datos) => ipcRenderer.invoke('enviar-datos', datos)
});
contextBridge.exposeInMainWorld('electron', {
  obtenerClientes: () => ipcRenderer.invoke('obtener-clientes'),
  eliminarCliente: (clienteId) => ipcRenderer.invoke('eliminar-cliente', clienteId),
  obtenerBebes: () => ipcRenderer.invoke('obtener-bebes'),
  eliminarBebe: (bebeId) => ipcRenderer.invoke('eliminar-bebe', bebeId),
  obtenerCajas: () => ipcRenderer.invoke('obtener-cajas'),
  eliminarCaja: (numeroCaja) => ipcRenderer.invoke('eliminar-caja', numeroCaja)
});