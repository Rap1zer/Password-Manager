const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  setMasterPass: (masterPass) =>
    ipcRenderer.send("set-master-password", masterPass),
  checkMasterPass: (masterPass) =>
    ipcRenderer.invoke("check-master-password", masterPass),
  createNewRecord: (formData) =>
    ipcRenderer.send("create-new-record", formData),
  getRecords: () => ipcRenderer.invoke("get-records"),
  createNewFolder: (folder) => ipcRenderer.send("create-new-folder", folder),
  deleteFolder: () => ipcRenderer.send("delete-folder", folder),
  getFolders: () => ipcRenderer.invoke("get-folders"),
});
