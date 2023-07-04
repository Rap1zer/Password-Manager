const loginBtn = document.getElementById("login-btn");
const passwordInput = document.getElementById("password-check");

passwordInput.addEventListener("input", () => {
  console.log("pressed a key");
});

addEventListener("submit", (event) => {
  // prevent form from submitting if password does not meet all requirements
  if (isPasswordValid()) {
  } else {
    event.preventDefault();
    console.log(passwordInput.value);
    window.api.setMasterPass(passwordInput.value);
  }
});
