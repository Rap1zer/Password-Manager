const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Datastore = require("nedb-promises");

const crypto = require("crypto");
const masterPassID = "iJzJ6V5yMawWqLEn";

const isDev = process.env.NODE_ENV !== "development";

const db = Datastore.create({
  filename: "./database.db",
  timestampData: true,
  autoload: true,
});

// Sets master password
ipcMain.on("set-master-password", (event, masterPassword) => {
  db.insert({ masterPassword: hashData(masterPassword), _id: masterPassID });
});

// Checks if master password inputted is matches the master password set. Returns true if it is, otherwise it'll return false.
ipcMain.handle("check-master-password", async (event, inputMasterPassword) => {
  return await db.findOne({ _id: masterPassID }).then((masterPassword) => {
    if (hashData(inputMasterPassword) === masterPassword.masterPassword) {
      console.log("passwords match");
      return true;
    }

    console.log("passwords don't match: " + masterPassword.masterPassword);
    return false;
  });
});

function hashData(data) {
  const hashValue = crypto
    .createHash("sha256")

    // Data to be encoded
    .update(data)

    // Defining encoding type
    .digest("hex");

  return hashValue;
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: isDev ? 1500 : 950,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.setMinimumSize(870, 650);

  // Open devtools if in dev environment
  if (isDev) {
    win.webContents.openDevTools();
  }

  win.loadFile("renderer/login.html");
};

app.whenReady().then(() => {
  createWindow();
});

//Close app if all windows are closed. Will close even if on Mac
app.on("window-all-closed", () => {
  app.quit();
});
