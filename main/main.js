const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Datastore = require("nedb-promises");

const crypto = require("crypto");
const masterPassID = "iJzJ6V5yMawWqLEn";
const salt = "796f79abfd25a6b8f657ddd44195f91f";
let derivedKey;

const isDev = process.env.NODE_ENV !== "development";

const db = Datastore.create({
  filename: "./database.db",
  timestampData: true,
  autoload: true,
});

// Sets master password
ipcMain.on("set-master-password", (e, masterPassword) => {
  db.insert({
    masterPassword: hashPassword(masterPassword),
    _id: masterPassID,
  });
  derivedKey = crypto.scryptSync(masterPassword, salt, 32);
});

// Checks if master password inputed matches the master password set. Returns true if it is, otherwise it'll return false.
ipcMain.handle("check-master-password", async (e, inputMasterPassword) => {
  try {
    let masterPass = await db.findOne({ _id: masterPassID });
    derivedKey = crypto.scryptSync(inputMasterPassword, salt, 32);
    return hashPassword(inputMasterPassword) === masterPass.masterPassword;
  } catch (error) {
    console.log(error);
  }
});

// Inserts the new record into the database
ipcMain.on("create-new-record", (e, formData) => {
  // Encrypt the password
  const passwordCipher = encryptPassword(formData.password);
  formData.password = passwordCipher.password;
  formData.salt = passwordCipher.salt;
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

// Returns specific record selected by user
ipcMain.handle("get-record", async (e, _id) => {
  try {
    return await db.findOne({ _id: _id });
  } catch (error) {
    console.log(error);
  }
});

// Inserts the new folder name into the database
ipcMain.on("create-new-folder", (e, folder) => {
  db.insert({ type: "folder", name: folder });
});

// Removes the folder with a specific folder name from the database
ipcMain.on("delete-folder", (e, folder) => {
  db.remove({ $and: [({ type: "folder" }, { name: folder })] });
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

// Find all the records in a specified folder
ipcMain.handle("get-records-in-folder", async (e, folderName) => {
  try {
    return await db.find({
      $and: [({ type: "record" }, { folder: folderName })],
    });
  } catch {
    return null;
  }
});

ipcMain.handle("get-starred-records", async () => {
  try {
    return await db.find({
      $and: [({ type: "record" }, { starred: true })],
    });
  } catch {
    return null;
  }
});

// Star or unstar a record
ipcMain.on("update-record", async (e, record) => {
  db.remove({ _id: record._id });
  db.insert(record);
});

// Create a cipher from the password
function encryptPassword(password) {
  const algorithm = "aes-256-gcm"; // encryption algorithm to be used
  const randomSalt = crypto.randomBytes(16); // The initial vector
  const cipher = crypto.createCipheriv(algorithm, derivedKey, randomSalt); // The cipher function
  // Encrypt the password using the cipher function and return the password and salt
  return {
    password: cipher.update(password, "utf-8", "hex"),
    salt: randomSalt,
  };
}

function hashPassword(password) {
  const hashValue = crypto
    .createHash("sha256")

    // Password to be encoded
    .update(password)

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
