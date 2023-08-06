const recordsSideBar = document.getElementById("side-records");
const sideMenu = document.getElementById("side-menu");
const folderSection = document.getElementById("folders-section");
const createFolderBtn = document.getElementById("create-folder-btn");
let oldSelectedFolder;

(async () => {
  // Wait for list of saved password records
  const records = await window.api.getRecords();
  console.log(records);

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
  for (let i = 0; i < records.length; i++) {}

  // Event listener for the create a folder button
  createFolderBtn.addEventListener("click", () => {
    folderSection.innerHTML += `
    <a class="folder-btn unselectable new-folder button-selected">
      <input type="text" id="new-folder">
    </a>`;

    changeSelectedBtn(folderSection.lastChild);

    // Reference to the text input in the new folder element
    const newFolderInput = document.getElementById("new-folder");
    newFolderInput.focus();

    // Event listener that fires after the enter key is pressed or the input is no longer focused
    newFolderInput.addEventListener("focusout", () => {
      createNewFolder(newFolderInput.value);
    });
    newFolderInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") createNewFolder(newFolderInput.value);
    });
  });
})();

folderSection.addEventListener("click", (e) => {
  if (e.target !== folderSection) {
    changeSelectedBtn(e.target);
  }
});

// Creates a new folder if a folder name is set
function createNewFolder(newFolderName) {
  if (newFolderName) {
    folderSection.lastChild.innerHTML = newFolderName;
    folderSection.lastChild.id = newFolderName + "_id";
    folderSection.lastChild.classList.remove("new-folder");
  } else {
    folderSection.lastChild.remove();
  }
}

function changeSelectedBtn(newSelectedBtn) {
  const selectedButtons = document.getElementsByClassName("button-selected");
  for (btn of selectedButtons) {
    if (btn.classList.contains("button-selected"))
      btn.classList.remove("button-selected");
  }

  newSelectedBtn.classList.add("button-selected");
}
