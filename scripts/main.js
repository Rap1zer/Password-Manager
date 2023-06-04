const { app, BrowserWindow } = require("electron");
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile("./scripts/index.html");
};

app.whenReady().then(() => {
  mainWindow = createWindow();
});

//On OS X it is common for the app to stay active even when windows are closed
app.on("window-all-closed", () => {
  if (process.platform != "darwin") {
    app.quit();
  }
});
