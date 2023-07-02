const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  setMasterPass: (masterPass) => ipcRenderer.send("masterPass", masterPass),
});
