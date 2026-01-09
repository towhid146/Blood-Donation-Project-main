/**
 * Blood Donation Management System - Authentication Handler
 * Handles login, signup, logout functionality
 */

document.addEventListener("DOMContentLoaded", function () {
  // Check for login form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    initLoginForm(loginForm);
  }

  // Check for signup form
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    initSignupForm(signupForm);
  }

  // Check for error parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("error")) {
    showError("Invalid username or password. Please try again.");
  }
});

/**
 * Initialize login form handler
 */
function initLoginForm(form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Disable button while processing
    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";

    try {
      const response = await api.login(username, password);

      if (response.success) {
        showSuccess("Login successful! Redirecting...");
        // Redirect to profile or specified page
        setTimeout(() => {
          window.location.href = response.redirect || "/profile";
        }, 500);
      }
    } catch (error) {
      showError(
        error.message || "Invalid username or password. Please try again."
      );
      submitBtn.disabled = false;
      submitBtn.textContent = "Login";
    }
  });
}

/**
 * Initialize signup form handler
 */
function initSignupForm(form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      username: document.getElementById("username").value.trim(),
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      number: document.getElementById("number").value.trim(),
      bloodType: document.getElementById("bloodType").value,
      location: document.getElementById("location").value.trim(),
      age: parseInt(document.getElementById("age").value),
      gender: document.getElementById("gender").value,
      password: document.getElementById("password").value,
    };

    const submitBtn = form.querySelector('button[type="submit"]');

    // Clear previous errors
    clearErrors();

    // Basic validation
    if (!validateSignupForm(formData)) {
      return;
    }

    // Disable button while processing
    submitBtn.disabled = true;
    submitBtn.textContent = "Signing up...";

    try {
      const response = await api.signup(formData);

      if (response.success) {
        showSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } catch (error) {
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach((err) => {
          showFieldError(err.path || err.param, err.msg);
        });
      } else {
        showError(error.message || "Registration failed. Please try again.");
      }
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign Up";
    }
  });
}

/**
 * Validate signup form
 */
function validateSignupForm(data) {
  let isValid = true;

  if (data.username.length < 3 || data.username.length > 20) {
    showFieldError("username", "Username must be between 3 and 20 characters");
    isValid = false;
  }

  if (!data.email.match(/^\S+@\S+\.\S+$/)) {
    showFieldError("email", "Please enter a valid email address");
    isValid = false;
  }

  if (!data.number.match(/^\+?[0-9]{10,15}$/)) {
    showFieldError("number", "Please enter a valid mobile number");
    isValid = false;
  }

  if (data.password.length < 6) {
    showFieldError("password", "Password must be at least 6 characters");
    isValid = false;
  }

  if (!data.bloodType) {
    showFieldError("bloodType", "Please select your blood type");
    isValid = false;
  }

  if (!data.gender) {
    showFieldError("gender", "Please select your gender");
    isValid = false;
  }

  return isValid;
}

/**
 * Show error message
 */
function showError(message) {
  let errorDiv = document.getElementById("error-message");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.id = "error-message";
    errorDiv.className =
      "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4";
    const form = document.querySelector("form");
    form.parentNode.insertBefore(errorDiv, form);
  }
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}

/**
 * Show success message
 */
function showSuccess(message) {
  let successDiv = document.getElementById("success-message");
  if (!successDiv) {
    successDiv = document.createElement("div");
    successDiv.id = "success-message";
    successDiv.className =
      "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4";
    const form = document.querySelector("form");
    form.parentNode.insertBefore(successDiv, form);
  }
  successDiv.textContent = message;
  successDiv.style.display = "block";
}

/**
 * Show field-specific error
 */
function showFieldError(fieldName, message) {
  const field = document.getElementById(fieldName);
  if (field) {
    field.classList.add("border-red-500");
    let errorP = field.parentNode.querySelector(".field-error");
    if (!errorP) {
      errorP = document.createElement("p");
      errorP.className = "field-error text-sm text-red-600 mt-1";
      field.parentNode.appendChild(errorP);
    }
    errorP.textContent = message;
  }
}

/**
 * Clear all errors
 */
function clearErrors() {
  document.querySelectorAll(".field-error").forEach((el) => el.remove());
  document
    .querySelectorAll(".border-red-500")
    .forEach((el) => el.classList.remove("border-red-500"));
  const errorDiv = document.getElementById("error-message");
  if (errorDiv) errorDiv.style.display = "none";
}

/**
 * Handle logout
 */
async function handleLogout() {
  try {
    await api.logout();
    window.location.href = "/homePage";
  } catch (error) {
    console.error("Logout failed:", error);
    // Redirect anyway
    window.location.href = "/homePage";
  }
}
