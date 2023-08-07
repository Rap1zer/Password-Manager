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
ipcMain.on("set-master-password", (e, masterPassword) => {
  db.insert({ masterPassword: hashData(masterPassword), _id: masterPassID });
});

// Checks if master password inputed matches the master password set. Returns true if it is, otherwise it'll return false.
ipcMain.handle("check-master-password", async (e, inputMasterPassword) => {
  try {
    let correctMasterPass = await db.findOne({ _id: masterPassID });
    return hashData(inputMasterPassword) === correctMasterPass.masterPassword;
  } catch (error) {
    console.log(error);
  }
});

// Inserts the new record into the database
ipcMain.on("create-new-record", (e, formData) => {
  db.insert(formData);
});

// Returns all the accounts / records stored in the database
ipcMain.handle("get-records", async () => {
  try {
    return await db.find({ type: "record" });
  } catch (error) {
    console.log(error);
    // returns if there are no records saved or an error occurred
    return null;
  }
});

// Inserts the new folder name into the database
ipcMain.on("create-new-folder", (e, folder) => {
  db.insert({ type: "folder", name: folder });
});

// Removes the folder with a specific folder name from the database
ipcMain.on("delete-folder", (e, folder) => {
  db.remove(
    { $and: [({ type: "folder" }, { name: folder })] },
    {},
    (error, docs) => {}
  );
});

// Returns all the folders stored in the database
ipcMain.handle("get-folders", async () => {
  try {
    const folders = await db.find({ type: "folder" });
    let folderNames = [];
    for (folder of folders) {
      folderNames.push(folder.name);
    }

    return await folderNames;
  } catch {
    // returns if there are no folders saved or an error occurred
    return null;
  }
});

ipcMain.handle("get-records-in-folder", async (e, folderName) => {
  try {
    return await db.find({
      $and: [({ type: "record" }, { folder: folderName })],
    });
  } catch {
    return null;
  }
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

  win.loadFile("renderer/main-page.html");
};

app.whenReady().then(() => {
  createWindow();
});

//Close app if all windows are closed. Will close even if on Mac
app.on("window-all-closed", () => {
  app.quit();
});
