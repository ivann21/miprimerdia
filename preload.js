const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  enviarDatos: (datos) => ipcRenderer.invoke('enviar-datos', datos)
});
