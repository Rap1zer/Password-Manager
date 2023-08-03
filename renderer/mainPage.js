const recordsSideBar = document.getElementById("side-records");

(async () => {
  const records = await window.api.getRecords();
  console.log(records);

  for (let i = 0; i < records.length; i++) {
    recordsSideBar.innerHTML += `<button class="record">
      <img class="record-icon" src="../images/unknown-logo.svg" alt="" />
      <div class="record-info">
        <h1 class="record-title">${records[i].title}</h1>
        <p class="record-description">${records[i].description}</p>
      </div>
    </button>`;
  }
})();
