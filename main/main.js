const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Datastore = require("nedb-promises");
const crypto = require("crypto");
const masterPassID = "iJzJ6V5yMawWqLEn";
const salt = "796f79abfd25a6b8f657ddd44195f91f";
const isDev = process.env.NODE_ENV !== "development";
let derivedKey;
let win;

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
  formData.authTag = passwordCipher.authTag;
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
    let record = await db.findOne({ _id: _id });
    return decryptRecord(record);
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

// Update a record's properties
ipcMain.on("update-record", async (e, record) => {
  db.remove({ _id: record._id });
  const passwordCipher = encryptPassword(record.password);
  record.password = passwordCipher.password;
  record.salt = passwordCipher.salt;
  record.authTag = passwordCipher.authTag;
  db.insert(record);
});

// Close the application
ipcMain.on("close-window", () => {
  win.close();
});

function encryptPassword(password) {
  const algorithm = "aes-256-gcm"; // encryption algorithm to be used
  const randomSalt = crypto.randomBytes(16); // The initial vector
  const cipher = crypto.createCipheriv(algorithm, derivedKey, randomSalt); // The cipher function
  // Encrypt the password using the cipher function
  let encryptedPassword = cipher.update(password, "utf-8", "hex");
  encryptedPassword += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  //return the password and salt
  return {
    password: encryptedPassword,
    salt: randomSalt,
    authTag: authTag.toString("hex"),
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

// Decrypt record password
function decryptRecord(record) {
  const algorithm = "aes-256-gcm"; // decryption algorithm to be used
  const iv = Buffer.from(Object.values(record.salt));
  // decipher function
  const decipher = crypto.createDecipheriv(algorithm, derivedKey, iv);

  // Provide the authentication tag
  decipher.setAuthTag(Buffer.from(record.authTag, "hex"));

  // Decrypt the password
  let decryptedPassword = decipher.update(record.password, "hex", "utf-8");
  console.log(decryptedPassword);
  decryptedPassword += decipher.final("utf-8");

  // Update and return record
  record.password = decryptedPassword;
  return record;
}

const createWindow = (fileToLoad) => {
  win = new BrowserWindow({
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

  win.loadFile(fileToLoad);
};

app.whenReady().then(async () => {
  const isAccountSetUp = await db.findOne({ _id: masterPassID });
  if (isAccountSetUp) {
    createWindow("renderer/login.html");
  } else {
    createWindow("renderer/signup.html");
  }
});

//Close app if all windows are closed. Will close even if on Mac
app.on("window-all-closed", () => {
  app.quit();
});
