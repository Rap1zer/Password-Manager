const loginBtn = document.getElementById("login-btn");
const passwordInput = document.getElementById("password-check");

loginBtn.addEventListener("click", async () => {
  const passwordsMatch = await window.api.checkMasterPass(passwordInput.value);

  if (passwordsMatch) {
    console.log("passwords match");
    window.location.href = "main-page.html";
  } else {
    console.log("passwords don't match");
  }
});
