const loginBtn = document.getElementById("login-btn");
const passwordInput = document.getElementById("password-check");

// Checks password inputed and logs users into the password manager
loginBtn.addEventListener("click", async () => {
  // Asynchronous function
  // Calls an asynchronous function which checks if the entered password matches the master password in the database
  const passwordsMatch = await window.api.checkMasterPass(passwordInput.value);

  if (passwordsMatch) {
    // If the passwords match, redirect the user to the main page
    window.location.href = "main-page.html";
  } else {
    // If the passwords don't match, show an alert message
    alert("password is incorrect");
  }
});
