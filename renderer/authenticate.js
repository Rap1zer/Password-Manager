const loginBtn = document.getElementById("login-btn");
const passwordInput = document.getElementById("password-check");

loginBtn.addEventListener("click", async () => {
  const validAuthentication = await window.api.checkMasterPass(
    passwordInput.value
  );

  if (validAuthentication) {
    console.log("passwords match");
  } else {
    console.log("passwords don't match");
  }
});
