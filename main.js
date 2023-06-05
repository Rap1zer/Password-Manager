const { app, BrowserWindow } = require("electron");

const isDev = process.env.NODE_ENV !== "development";

const createWindow = () => {
  const win = new BrowserWindow({
    width: isDev ? 1500 : 950,
    height: 700,
  });

  win.setMinimumSize(870, 650);

  // Open devtools if in dev environment
  if (isDev) {
    win.webContents.openDevTools();
  }

  win.loadFile("renderer/signup.html");
};

app.whenReady().then(() => {
  createWindow();
});

//Menu template

//Close app if all windows are closed. Will close even if on Mac
app.on("window-all-closed", () => {
  app.quit();
});
