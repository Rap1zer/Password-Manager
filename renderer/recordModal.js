const modal = document.getElementById("record-modal");
const modalBackdrop = document.getElementById("modal-backdrop");
const exitModalBtn = document.getElementById("exit-modal-btn");
const submitRecordBtn = document.getElementById("new-record-submit");
const recordForm = document.getElementById("record-modal-form");
const iFrame = document.getElementById("password-details");
let newRecordBtn;
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

  // Open record modal after clicking the "new record" button
  newRecordBtn.addEventListener("click", () => {
    modal.style.display = "block";
    modalBackdrop.style.display = "block";
  });
});

exitModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
  modalBackdrop.style.display = "none";
  recordForm.reset();
});

recordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  window.api.createNewRecord(convertFormToObj(formData));
});

function convertFormToObj(formData) {
  const formDataObj = {};
  for (const pair of formData.entries()) {
    formDataObj[pair[0]] = pair[1];
  }
  return formDataObj;
}
