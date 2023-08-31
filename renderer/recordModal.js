const modal = document.getElementById("record-modal");
const modalBackdrop = document.getElementById("modal-backdrop");
const exitModalBtn = document.getElementById("exit-modal-btn");
const submitRecordBtn = document.getElementById("new-record-submit");
const recordForm = document.getElementById("record-modal-form");
const modalTitle = document.getElementById("modal-title");
const folderSelection = document.getElementById("form-folder-select");
const iFrame = document.getElementById("password-details");
let newRecordBtn;
let deleteRecordBtn;
let editBtn;

// Function to get iFrame document in order to access DOM elements
function iframeRef(frameRef) {
  return frameRef.contentWindow
    ? frameRef.contentWindow.document
    : frameRef.contentDocument;
}

// Gets called after iFrame contents are loaded. (Otherwise script cannot accesss iFrame DOM objects)
iFrame.addEventListener("load", () => {
  const iFrameDoc = iframeRef(iFrame);
  newRecordBtn = iFrameDoc.getElementById("new-record-btn");
  editBtn = iFrameDoc.getElementById("edit-btn");
  deleteRecordBtn = iFrameDoc.getElementById("delete-record-btn");

  // Open record modal after clicking the "new record" button
  newRecordBtn.addEventListener("click", () => {
    modalTitle.innerText = "New record";
    openModal();
  });

  // Open record modal after clicking the "edit" button
  editBtn.addEventListener("click", () => {
    if (selectedRecord) {
      modalTitle.innerText = "Edit record";

      // Update the value of each input field with the values in the currently selected record
      const inputFields = recordForm.querySelectorAll("[name]");
      for (let i = 0; i < inputFields.length; i++) {
        // The value of the input field equals the value of the property from the selected record
        inputFields[i].value = selectedRecord[Object.keys(selectedRecord)[i]];
      }

      openModal();
    }
  });

  // Delete the selected record
  deleteRecordBtn.addEventListener("click", () => {
    if (selectedRecord) {
      window.api.deleteRecord(selectedRecord);

      // Remove record from record side bar / DOM
      const recordToUnload = document.getElementById(selectedRecord._id);
      recordToUnload.remove();

      recordDetails.innerHTML = "";
    }
  });
});

// Close record modal after clicking the "exit modal" button
exitModalBtn.addEventListener("click", () => {
  closeModal();
});

// Called when the record is submitted
recordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  formData.append("type", "record");

  // If a new record is created, send formdata to main process to create new record
  if (modalTitle.innerText === "New record") {
    window.api.createNewRecord(convertFormToObj(formData));
    formData.append("starred", false); // Appends a new value indicating if the record is starred
    console.log("created new form");
  } else if (modalTitle.innerText === "Edit record") {
    // If an existing record is edited, update record data in database
    formData.append("starred", selectedRecord["starred"]); // Appends a new value indicating if the record is starred
    formData.append("_id", selectedRecord["_id"]);
    window.api.updateRecord(convertFormToObj(formData));
  }

  location.reload();
});

//Converts form to object
function convertFormToObj(formData) {
  const formDataObj = {};
  for (const pair of formData.entries()) {
    formDataObj[pair[0]] = pair[1];
  }
  return formDataObj;
}

// Opens record modal
function openModal() {
  modal.style.display = "block";
  modalBackdrop.style.display = "block";

  folderSelection.innerHTML = `<option value="None">None</option>`;
  // load folders onto the record modal
  for (let i = 0; i < folders.length; i++) {
    folderSelection.innerHTML += `
    <option value="${folders[i]}">${folders[i]}</option>`;
  }
}

// Closes record modal
function closeModal() {
  modal.style.display = "none";
  modalBackdrop.style.display = "none";
  recordForm.reset();
}
