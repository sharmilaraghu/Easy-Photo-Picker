const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectFolder: async (type) => {
    console.log('Selecting folder type:', type);
    const result = await ipcRenderer.invoke('select-folder', type);
    console.log('Folder selected:', result);
    return result;
  }
});

console.log('Preload script loaded successfully');
