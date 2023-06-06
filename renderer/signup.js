const getStartedBtn = document.getElementById("get-started-btn");
const passwordInput = document.getElementById("password");
const passwordCheckInput = document.getElementById("password-check");
let isPasswordValid = false;

passwordInput.addEventListener("input", () => {
  console.log(checkPasswordValidity());
});

passwordCheckInput.addEventListener("input", () => {});

getStartedBtn.addEventListener("click", () => {
  // go to main page if sign up was successful
  location.href = "main-page.html";
  console.log("btn clicked");
});

function checkPasswordValidity() {
  // check if password has at least 15 characters
  if (passwordInput.value.length < 15) return false;

  // check if password has at least one special character
  let specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (!specialChars.test(passwordInput.value)) return false;

  // check if password has at least one uppercase character
  let 
  
  return true;
}
