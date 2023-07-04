const loginBtn = document.getElementById("login-btn");
const passwordInput = document.getElementById("password-check");

passwordInput.addEventListener("input", () => {
  console.log("input changed");
});

loginBtn.addEventListener("click", async () => {
  let validAuthentication = await window.api.checkMasterPass(
    passwordInput.value
  );
});
