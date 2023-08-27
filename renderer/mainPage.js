const recordsSideBar = document.getElementById("records-list");
const sideMenu = document.getElementById("side-menu");
const folderSection = document.getElementById("folders-section");
const createFolderBtn = document.getElementById("create-folder-btn");
const deleteFolderBtn = document.getElementById("delete-folder-btn");
const everythingBtn = document.getElementById("everything-btn");
const starredBtn = document.getElementById("starred-btn");
let recordDetails;
let folders;

everythingBtn.focus();
changeSelectedBtn(everythingBtn);

(async () => {
  // Wait for information saved in database
  const records = await window.api.getRecords(); // List of records
  folders = await window.api.getFolders(); // List of folders
  console.log(folders);

  loadRecordsOntoSidebar(records);

  // load folders onto the folders side menu
  for (let i = 0; i < folders.length; i++) {
    folderSection.innerHTML += `
    <a class="folder-btn unselectable">
      ${folders[i]}
    </a>`;
  }
})();

// Gets called after iFrame contents are loaded. (Otherwise script cannot accesss iFrame DOM objects)
iFrame.addEventListener("load", () => {
  const iFrameDoc = iframeRef(iFrame);
  recordDetails = iFrameDoc.getElementById("record-details");
});

// Event listener for the create a folder button
createFolderBtn.addEventListener("click", () => {
  folderSection.innerHTML += `
    <a class="folder-btn unselectable new-folder">
      <input type="text" id="new-folder">
    </a>`;

  changeSelectedBtn(folderSection.lastChild, []);

  // Reference to the text input in the new folder element
  const newFolderInput = document.getElementById("new-folder");
  newFolderInput.focus();

  // Function must be enclosed in another function otherwise javascript will fire the event listener function immediately
  const callback = () => {
    createNewFolder(newFolderInput.value);
  };

  // Event listener that fires after the enter key is pressed or the input is no longer focused
  newFolderInput.addEventListener("blur", callback);
  newFolderInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      newFolderInput.removeEventListener("blur", callback); // remove this event listener to prevent the create new folder function from being called twice
      createNewFolder(newFolderInput.value);
    }
  });
});

recordsSideBar.addEventListener("click", async (e) => {
  const selectedRecord = await window.api.getRecord(e.target.id); // Find specific record with ID
  console.log(selectedRecord);
  recordDetails.innerHTML = `
    <h1 class="title">
    <span>${selectedRecord.title}</span>
    <button class="star-record-btn" id="star-record-btn"></button>
    </h1>
    <p class="description">${selectedRecord.description}</p>
    <p class="web-address">Website address: ${selectedRecord["web-address"]}</p>
    <p class="username">Username: ${selectedRecord.username}</p>
    <p class="password">Password: ${selectedRecord.password}</p>
  `;
});

everythingBtn.addEventListener("click", async (e) => {
  const records = await window.api.getRecords(); // List of records
  changeSelectedBtn(everythingBtn, records);
});

starredBtn.addEventListener("click", (e) => {
  changeSelectedBtn(starredBtn);
});

// Delete folder
deleteFolderBtn.addEventListener("click", async () => {
  const selectedFolder =
    folderSection.getElementsByClassName("button-selected")[0];

  if (selectedFolder) {
    window.api.deleteFolder(selectedFolder.innerText);
    folders.splice(folders.indexOf(selectedFolder.innerText), 1);
    selectedFolder.remove();
    everythingBtn.focus();

    const records = await window.api.getRecords(); // List of records
    changeSelectedBtn(everythingBtn, records);
  }
});

folderSection.addEventListener("click", async (e) => {
  if (e.target.classList.contains("folder-btn")) {
    const folderRecords = await window.api.getRecordsInFolder(
      e.target.innerText
    );
    changeSelectedBtn(e.target, folderRecords);
  }
});

// Creates a new folder if a folder name is set
function createNewFolder(newFolderName) {
  // Create folder if the folder name is not empty
  breakFolderCreation: if (newFolderName) {
    newFolderName = newFolderName.trim();

    // if folder name already exists, alert user and break out of if statement
    if (folders.includes(newFolderName)) {
      alert("Folder name already exists. Choose a different name.");
      break breakFolderCreation;
    }

    folderSection.lastChild.innerHTML = newFolderName;
    folderSection.lastChild.id = newFolderName + "_id";
    folderSection.lastChild.classList.remove("new-folder");
    window.api.createNewFolder(newFolderName);
    folders.push(newFolderName);
    loadRecordsOntoSidebar([]);
  } else {
    folderSection.lastChild.remove();
  }
}

function changeSelectedBtn(newSelectedBtn, recordsToLoad) {
  // remove class from the old selected button
  const selectedButtons = sideMenu.getElementsByClassName("button-selected");
  for (btn of selectedButtons) {
    if (btn.classList.contains("button-selected"))
      btn.classList.remove("button-selected");
  }

  // Check if the newly selected button is a folder
  if (newSelectedBtn.classList.contains("folder-btn")) {
    deleteFolderBtn.style.visibility = "visible";
  } else {
    deleteFolderBtn.style.visibility = "hidden";
  }

  // add "button-selected" class to the newly selected button
  newSelectedBtn.classList.add("button-selected");

  if (recordsToLoad) loadRecordsOntoSidebar(recordsToLoad);
}

function loadRecordsOntoSidebar(recordsToLoad) {
  recordsSideBar.innerHTML = "";
  // load records onto the records sidebar
  for (let i = 0; i < recordsToLoad.length; i++) {
    recordsSideBar.innerHTML += `
    <button class="record" id="${recordsToLoad[i]._id}">
      <img class="record-icon" id="${recordsToLoad[i]._id}" src="../images/unknown-logo.svg" alt="" />
      <div class="record-info" id="${recordsToLoad[i]._id}">
        <h1 class="record-title" id="${recordsToLoad[i]._id}">${recordsToLoad[i].title}</h1>
        <p class="record-description" id="${recordsToLoad[i]._id}">${recordsToLoad[i].description}</p>
      </div>
    </button>`;
  }
}
