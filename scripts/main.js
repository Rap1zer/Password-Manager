const { app, BrowserWindow } = require("electron");
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile("./scripts/login-page.html");
};

app.whenReady().then(() => {
  createWindow();
});

//On OS X it is common for the app to stay active even when windows are closed, this code prevents that
app.on("window-all-closed", () => {
  app.quit();
});
