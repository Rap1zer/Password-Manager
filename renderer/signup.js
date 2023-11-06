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

// Add an event listener to the form's "submit" event.
addEventListener("submit", (event) => {
  // Check if the submitted password meets requirements and is retyped correctly.
  if (isPasswordValid() && passwordCheckInput.value === passwordInput.value) {
    // If conditions are met, set the master password using the Electron API.
    window.api.setMasterPass(passwordInput.value);
  } else {
    // Prevent the form from submitting if password does not meet all requirements
    event.preventDefault();

    // Check if the passwords don't match and display an alert if they don't.
    if (passwordCheckInput.value !== passwordInput.value) {
      alert("Passwords do not match.");
    }
    // Check if the password doesn't meet all requirements and display an alert if so.
    if (!isPasswordValid()) {
      alert("Password does not meet all the requirements.");
    }
  }
});

// Updates the UI to show users which password requirements are met when creating a new master password
// Returns whether the password matches all the requirements
function isPasswordValid() {
  let passwordValidity = true;

  // check if password has at least 15 characters
  if (passwordInput.value.length >= 15) {
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
