const modal = document.getElementById("record-modal");
const modalBackdrop = document.getElementById("modal-backdrop");
const exitModalBtn = document.getElementById("exit-modal-btn");
const submitRecordBtn = document.getElementById("new-record-submit");
const recordForm = document.getElementById("record-modal-form");
const folderSelection = document.getElementById("form-folder-select");
const iFrame = document.getElementById("password-details");
let newRecordBtn;
let editBtn;

// Wait for list of folders from database
(async () => {
  const folders = await window.api.getFolders();

  // load folders onto the record modal
  for (let i = 0; i < folders.length; i++) {
    folderSelection.innerHTML += `
    <option value="${folders[i].name}">${folders[i].name}</option>`;
  }
})();

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

  // Open record modal after clicking the "new record" button
  newRecordBtn.addEventListener("click", () => {
    openModal();
  });
});

// Close record modal after clicking the "exit modal" button
exitModalBtn.addEventListener("click", () => {
  closeModal();
});

// Called when the new record is submitted
recordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  formData.append("selected", true); // Appends a new value which indicates whether the record is selected
  formData.append("type", "record");
  window.api.createNewRecord(convertFormToObj(formData));
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
}

// Closes record modal
function closeModal() {
  modal.style.display = "none";
  modalBackdrop.style.display = "none";
  recordForm.reset();
}
