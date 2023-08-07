const recordsSideBar = document.getElementById("side-records");
const sideMenu = document.getElementById("side-menu");
const folderSection = document.getElementById("folders-section");
const createFolderBtn = document.getElementById("create-folder-btn");
const deleteFolderBtn = document.getElementById("delete-folder-btn");
const everythingBtn = document.getElementById("everything-btn");
const starredBtn = document.getElementById("starred-btn");

everythingBtn.focus();
changeSelectedBtn(everythingBtn);

(async () => {
  // Wait for information saved in database
  const records = await window.api.getRecords(); // List of records
  const folders = await window.api.getFolders(); // List of folders
  console.log(folders);

  // load records onto the records sidebar
  for (let i = 0; i < records.length; i++) {
    recordsSideBar.innerHTML += `
    <button class="record">
      <img class="record-icon" src="../images/unknown-logo.svg" alt="" />
      <div class="record-info">
        <h1 class="record-title">${records[i].title}</h1>
        <p class="record-description">${records[i].description}</p>
      </div>
    </button>`;
  }

  // load folders onto the folders side menu
  for (let i = 0; i < folders.length; i++) {
    folderSection.innerHTML += `
    <a class="folder-btn unselectable">
      ${folders[i].name}
    </a>`;
  }
})();

// Event listener for the create a folder button
createFolderBtn.addEventListener("click", () => {
  folderSection.innerHTML += `
    <a class="folder-btn unselectable new-folder">
      <input type="text" id="new-folder">
    </a>`;

  changeSelectedBtn(folderSection.lastChild);

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

everythingBtn.addEventListener("click", (e) => {
  changeSelectedBtn(everythingBtn);
});

starredBtn.addEventListener("click", (e) => {
  changeSelectedBtn(starredBtn);
});

// Delete folder
deleteFolderBtn.addEventListener("click", (e) => {
  const selectedFolder =
    folderSection.getElementsByClassName("button-selected")[0];

  if (selectedFolder) {
    window.api.deleteFolder(selectedFolder);
    selectedFolder.remove();
  }
});

folderSection.addEventListener("click", (e) => {
  if (e.target.classList.contains("folder-btn")) {
    changeSelectedBtn(e.target);
  }
});

// Creates a new folder if a folder name is set
function createNewFolder(newFolderName) {
  if (newFolderName) {
    folderSection.lastChild.innerHTML = newFolderName;
    folderSection.lastChild.id = newFolderName + "_id";
    folderSection.lastChild.classList.remove("new-folder");
    window.api.createNewFolder(newFolderName);
  } else {
    folderSection.lastChild.remove();
  }
}

function changeSelectedBtn(newSelectedBtn) {
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
}
