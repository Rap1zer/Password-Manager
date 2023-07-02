const getStartedBtn = document.getElementById("get-started-btn");
const signupForm = document.getElementById("signup-form");
const passwordInput = document.getElementById("password");
const passwordCheckInput = document.getElementById("password-check");
const requirementsEl = document.getElementsByTagName("li");

passwordInput.addEventListener("input", () => {
  isPasswordValid();
});

// function makes sure that the password input fields do not accept spaces
signupForm.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
  }
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

passwordCheckInput.addEventListener("input", () => {});

function isPasswordValid() {
  let passwordValidity = true;

  // check if password has at least 15 characters
  if (passwordInput.value.length > 15) {
    requirementsEl[0].classList.remove("criteria-not-met");
    requirementsEl[0].classList.add("criteria-met");
  } else {
    requirementsEl[0].classList.add("criteria-not-met");
    requirementsEl[0].classList.remove("criteria-met");
    passwordValidity = false;
  }

  // check if password has at least one special character
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (specialChars.test(passwordInput.value)) {
    requirementsEl[1].classList.remove("criteria-not-met");
    requirementsEl[1].classList.add("criteria-met");
  } else {
    requirementsEl[1].classList.add("criteria-not-met");
    requirementsEl[1].classList.remove("criteria-met");
    passwordValidity = false;
  }

  // check if password has uppercase characters
  const upperCase = /[A-Z]/;
  if (upperCase.test(passwordInput.value)) {
    requirementsEl[2].classList.remove("criteria-not-met");
    requirementsEl[2].classList.add("criteria-met");
  } else {
    requirementsEl[2].classList.add("criteria-not-met");
    requirementsEl[2].classList.remove("criteria-met");
    passwordValidity = false;
  }

  //check if password has lowercase characters
  const lowerCase = /[a-z]/;
  if (lowerCase.test(passwordInput.value)) {
    requirementsEl[3].classList.remove("criteria-not-met");
    requirementsEl[3].classList.add("criteria-met");
  } else {
    requirementsEl[3].classList.add("criteria-not-met");
    requirementsEl[3].classList.remove("criteria-met");
    passwordValidity = false;
  }

  // check if password has at least one number
  const numbers = /[1234567890]/;
  if (numbers.test(passwordInput.value)) {
    requirementsEl[4].classList.remove("criteria-not-met");
    requirementsEl[4].classList.add("criteria-met");
  } else {
    requirementsEl[4].classList.add("criteria-not-met");
    requirementsEl[4].classList.remove("criteria-met");
    passwordValidity = false;
  }

  return passwordValidity;
}
