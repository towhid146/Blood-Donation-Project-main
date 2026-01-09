/**
 * Blood Donation Management System - Profile Page Handler
 * Handles profile display and updates
 */

// Store current user data for editing
let currentUserData = null;

document.addEventListener("DOMContentLoaded", function () {
  loadProfile();
  initEditProfileModal();
});

/**
 * Load user profile data
 */
async function loadProfile() {
  try {
    const data = await api.getProfile();

    if (data.user) {
      currentUserData = data.user; // Store for editing
      displayProfile(data.user);
      displayEligibility(data.eligibility);
      if (data.donations) {
        displayRecentDonations(data.donations);
      }
    }
  } catch (error) {
    if (error.status === 401) {
      // Not authenticated, redirect to login
      window.location.href = "/login";
    } else {
      showError("Failed to load profile. Please try again.");
    }
  }
}

/**
 * Display user profile data
 */
function displayProfile(user) {
  // Name
  const nameEl =
    document.querySelector("h2.text-2xl") ||
    document.querySelector('[data-field="name"]');
  if (nameEl) {
    nameEl.textContent = `${user.firstName} ${user.lastName}`;
  }

  // Blood type
  const bloodTypeEl = document.querySelector('[data-field="bloodType"]');
  if (bloodTypeEl) {
    bloodTypeEl.innerHTML = `<i class="fas fa-tint mr-2"></i>${user.bloodType} Blood Group`;
  }

  // Profile details
  setTextContent('[data-field="age"]', user.age);
  setTextContent('[data-field="gender"]', user.gender);
  setTextContent(
    '[data-field="lastDonationDate"]',
    formatDate(user.lastDonationDate)
  );

  // Location - show full location if available
  const locationText =
    user.fullLocation ||
    user.location ||
    [user.upazila, user.district, user.division].filter(Boolean).join(", ") ||
    "--";
  setTextContent('[data-field="location"]', locationText);

  // Additional profile fields
  setTextContent('[data-field="email"]', user.email);
  setTextContent('[data-field="phone"]', user.number);
  setTextContent(
    '[data-field="fullName"]',
    `${user.firstName} ${user.lastName}`
  );
  setTextContent('[data-field="city"]', user.district || user.location || "--");
  setTextContent('[data-field="bloodTypeDisplay"]', user.bloodType);

  // Donation stats
  const donationsCount = user.donationsCount || 0;
  const completedRequests = user.completedRequests || 0;
  const missedRequests = user.missedRequests || 0;
  const totalConfirmed = completedRequests + missedRequests;

  setTextContent('[data-field="donationsCount"]', donationsCount);
  setTextContent('[data-field="completedRequests"]', completedRequests);
  setTextContent('[data-field="completedCount"]', completedRequests);
  setTextContent('[data-field="missedRequests"]', missedRequests);
  setTextContent('[data-field="totalConfirmed"]', totalConfirmed);

  // Lives saved (estimate: each donation can save up to 3 lives)
  setTextContent('[data-field="livesSaved"]', donationsCount * 3);

  // Response ratio
  const ratio = calculateResponseRatio(completedRequests, missedRequests);
  setTextContent('[data-field="responseRatio"]', `${ratio}%`);
  setTextContent("#responseRatioText", `${ratio}%`);
  setTextContent("#percentage", `${ratio}%`);

  // Update progress circle with animation
  updateProgressCircle(ratio);

  // Profile Completion
  displayProfileCompletion(
    user.profileCompletion || 0,
    user.missingFields || []
  );
}

/**
 * Display profile completion percentage
 */
function displayProfileCompletion(percentage, missingFields) {
  const percentEl = document.getElementById("profileCompletionPercent");
  const barEl = document.getElementById("profileCompletionBar");
  const missingSection = document.getElementById("missingFieldsSection");
  const missingList = document.getElementById("missingFieldsList");
  const completedMsg = document.getElementById("completedMessage");

  // Animate percentage
  if (percentEl) {
    animateProfileCompletion(percentEl, 0, percentage, 1000);
  }

  // Animate progress bar
  if (barEl) {
    setTimeout(() => {
      barEl.style.width = `${percentage}%`;

      // Change color based on completion
      if (percentage >= 100) {
        barEl.className =
          "bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000";
      } else if (percentage >= 70) {
        barEl.className =
          "bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-1000";
      }
    }, 100);
  }

  // Show missing fields or completed message
  if (percentage >= 100) {
    if (completedMsg) completedMsg.classList.remove("hidden");
    if (missingSection) missingSection.classList.add("hidden");
  } else if (missingFields && missingFields.length > 0) {
    if (missingSection) missingSection.classList.remove("hidden");
    if (completedMsg) completedMsg.classList.add("hidden");

    if (missingList) {
      missingList.innerHTML = missingFields
        .map(
          (field) =>
            `<span class="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full border border-yellow-200">
          <i class="fas fa-exclamation-circle mr-1"></i>${field}
        </span>`
        )
        .join("");
    }
  }
}

/**
 * Animate profile completion counter
 */
function animateProfileCompletion(element, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * easeOut);

    element.textContent = `${current}%`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Display eligibility status
 */
function displayEligibility(eligibility) {
  if (!eligibility) return;

  const eligibilitySection = document.getElementById("eligibility-status");
  if (eligibilitySection) {
    if (eligibility.eligible) {
      eligibilitySection.innerHTML = `
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    <strong>You are eligible to donate!</strong>
                    <p>${eligibility.message}</p>
                </div>
            `;
    } else {
      eligibilitySection.innerHTML = `
                <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    <strong>Not yet eligible</strong>
                    <p>${eligibility.message}</p>
                    ${
                      eligibility.eligibleDate
                        ? `<p>Next eligible date: ${formatDate(
                            eligibility.eligibleDate
                          )}</p>`
                        : ""
                    }
                </div>
            `;
    }
  }
}

/**
 * Display recent donations
 */
function displayRecentDonations(donations) {
  const container = document.getElementById("recent-donations");
  if (!container || !donations.length) return;

  let html =
    '<h4 class="font-semibold mb-2">Recent Donations</h4><ul class="space-y-2">';
  donations.forEach((donation) => {
    html += `
            <li class="border-b pb-2">
                <span class="font-medium">${formatDate(donation.donDate)}</span>
                ${donation.hospital ? ` at ${donation.hospital.hbcName}` : ""}
                <span class="text-gray-500 text-sm ml-2">${
                  donation.status
                }</span>
            </li>
        `;
  });
  html += "</ul>";
  container.innerHTML = html;
}

/**
 * Calculate response ratio
 */
function calculateResponseRatio(completed, missed) {
  const total = (completed || 0) + (missed || 0);
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Update the circular progress indicator
 */
function updateProgressCircle(percentage) {
  const progressBar = document.querySelector(".progress-bar");
  if (progressBar) {
    const circumference = 2 * Math.PI * 45; // 282.7 for r=45
    const offset = circumference - (percentage / 100) * circumference;

    // Animate the progress after a short delay
    setTimeout(() => {
      progressBar.style.strokeDashoffset = offset;
    }, 300);
  }

  // Also animate the percentage text
  const percentageEl = document.getElementById("percentage");
  if (percentageEl) {
    animateCounter(percentageEl, 0, percentage, 1000);
  }
}

/**
 * Animate counter from start to end
 */
function animateCounter(element, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * easeOut);

    element.textContent = `${current}%`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Helper to set text content
 */
function setTextContent(selector, value) {
  const el = document.querySelector(selector);
  if (el) {
    el.textContent = value;
  }
}

/**
 * Show error message
 */
function showError(message) {
  const main = document.querySelector("main");
  if (main) {
    const errorDiv = document.createElement("div");
    errorDiv.className =
      "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-4";
    errorDiv.textContent = message;
    main.insertBefore(errorDiv, main.firstChild);
  }
}

/**
 * Handle profile photo change
 */
function initPhotoUpload() {
  const changePhotoBtn = document.getElementById("changePhotoButton");
  const fileInput = document.getElementById("fileInput");
  const profileImage = document.getElementById("profileImage");

  if (changePhotoBtn && fileInput) {
    changePhotoBtn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          if (profileImage) {
            profileImage.src = e.target.result;
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// Initialize photo upload on load
document.addEventListener("DOMContentLoaded", initPhotoUpload);

/**
 * Initialize Edit Profile Modal
 */
function initEditProfileModal() {
  const modal = document.getElementById("editProfileModal");
  const editBtn = document.getElementById("editProfileBtn");
  const editDonorInfoBtn = document.getElementById("editDonorInfoBtn");
  const closeBtn = document.getElementById("closeModalBtn");
  const cancelBtn = document.getElementById("cancelEditBtn");
  const form = document.getElementById("editProfileForm");
  const bioTextarea = document.getElementById("editBio");
  const charCount = document.getElementById("bioCharCount");

  // Open modal from header button
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      openEditModal();
    });
  }

  // Open modal from donor info section button
  if (editDonorInfoBtn) {
    editDonorInfoBtn.addEventListener("click", () => {
      openEditModal();
    });
  }

  // Close modal handlers
  if (closeBtn) {
    closeBtn.addEventListener("click", closeEditModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeEditModal);
  }

  // Close on backdrop click
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.id === "modalBackdrop") {
        closeEditModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
      closeEditModal();
    }
  });

  // Bio character counter
  if (bioTextarea && charCount) {
    bioTextarea.addEventListener("input", () => {
      charCount.textContent = bioTextarea.value.length;
    });
  }

  // Form submission
  if (form) {
    form.addEventListener("submit", handleEditProfileSubmit);
  }

  // Initialize location dropdowns
  initLocationDropdowns();
}

/**
 * Open edit profile modal and populate with current data
 */
function openEditModal() {
  const modal = document.getElementById("editProfileModal");
  if (!modal || !currentUserData) return;

  // Populate form fields with current data
  populateEditForm(currentUserData);

  // Show modal
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Prevent background scrolling
}

/**
 * Close edit profile modal
 */
function closeEditModal() {
  const modal = document.getElementById("editProfileModal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = ""; // Restore scrolling
  }
}

/**
 * Populate edit form with user data
 */
function populateEditForm(user) {
  // Personal Info
  setFormValue("editFirstName", user.firstName);
  setFormValue("editLastName", user.lastName);
  setFormValue("editAge", user.age);
  setFormValue("editGender", user.gender);
  setFormValue("editNumber", user.number);
  setFormValue("editBloodType", user.bloodType);

  // Location - Set division first, then district, then upazila
  const divisionSelect = document.getElementById("editDivision");
  const districtSelect = document.getElementById("editDistrict");
  const upazilaSelect = document.getElementById("editUpazila");

  if (divisionSelect && user.division) {
    divisionSelect.value = user.division;
    // Trigger district population
    populateDistricts(user.division);

    // After districts are populated, set district value
    setTimeout(() => {
      if (districtSelect && user.district) {
        districtSelect.value = user.district;
        // Trigger upazila population
        populateUpazilas(user.division, user.district);

        // After upazilas are populated, set upazila value
        setTimeout(() => {
          if (upazilaSelect && user.upazila) {
            upazilaSelect.value = user.upazila;
          }
        }, 50);
      }
    }, 50);
  }

  // Additional Info
  setFormValue("editWeight", user.weight);
  setFormValue("editBio", user.bio);

  // Medical conditions checkbox
  const medicalCheckbox = document.getElementById("editHasMedicalConditions");
  if (medicalCheckbox) {
    medicalCheckbox.checked = user.hasMedicalConditions || false;
  }

  // Update bio character count
  const charCount = document.getElementById("bioCharCount");
  const bioTextarea = document.getElementById("editBio");
  if (charCount && bioTextarea) {
    charCount.textContent = bioTextarea.value.length;
  }
}

/**
 * Helper function to set form field value
 */
function setFormValue(elementId, value) {
  const element = document.getElementById(elementId);
  if (element && value !== undefined && value !== null) {
    element.value = value;
  }
}

/**
 * Initialize location dropdown cascading
 */
function initLocationDropdowns() {
  const divisionSelect = document.getElementById("editDivision");
  const districtSelect = document.getElementById("editDistrict");
  const upazilaSelect = document.getElementById("editUpazila");

  if (!divisionSelect || !districtSelect || !upazilaSelect) return;

  // Check if BD_LOCATIONS is available
  if (typeof BD_LOCATIONS === "undefined") {
    console.warn("BD_LOCATIONS not loaded");
    return;
  }

  // Populate divisions
  BD_LOCATIONS.divisions.forEach((division) => {
    const option = document.createElement("option");
    option.value = division.name;
    option.textContent = division.name;
    divisionSelect.appendChild(option);
  });

  // Division change handler
  divisionSelect.addEventListener("change", function () {
    const selectedDivision = this.value;
    populateDistricts(selectedDivision);
    // Reset upazila
    upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';
  });

  // District change handler
  districtSelect.addEventListener("change", function () {
    const selectedDivision = divisionSelect.value;
    const selectedDistrict = this.value;
    populateUpazilas(selectedDivision, selectedDistrict);
  });
}

/**
 * Populate districts based on selected division
 */
function populateDistricts(divisionName) {
  const districtSelect = document.getElementById("editDistrict");
  const upazilaSelect = document.getElementById("editUpazila");
  if (!districtSelect || typeof BD_LOCATIONS === "undefined") return;

  // Reset district dropdown
  districtSelect.innerHTML = '<option value="">Select District</option>';
  districtSelect.disabled = true;

  // Reset upazila dropdown
  if (upazilaSelect) {
    upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';
    upazilaSelect.disabled = true;
  }

  if (!divisionName) return;

  // Find selected division
  const division = BD_LOCATIONS.divisions.find((d) => d.name === divisionName);
  if (division && division.districts) {
    division.districts.forEach((district) => {
      const option = document.createElement("option");
      option.value = district.name;
      option.textContent = district.name;
      districtSelect.appendChild(option);
    });
    districtSelect.disabled = false;
  }
}

/**
 * Populate upazilas based on selected division and district
 */
function populateUpazilas(divisionName, districtName) {
  const upazilaSelect = document.getElementById("editUpazila");
  if (!upazilaSelect || typeof BD_LOCATIONS === "undefined") return;

  // Reset upazila dropdown
  upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';
  upazilaSelect.disabled = true;

  if (!divisionName || !districtName) return;

  // Find selected division and district
  const division = BD_LOCATIONS.divisions.find((d) => d.name === divisionName);
  if (division) {
    const district = division.districts.find((d) => d.name === districtName);
    if (district && district.upazilas) {
      district.upazilas.forEach((upazila) => {
        const option = document.createElement("option");
        option.value = upazila;
        option.textContent = upazila;
        upazilaSelect.appendChild(option);
      });
      upazilaSelect.disabled = false;
    }
  }
}

/**
 * Handle edit profile form submission
 */
async function handleEditProfileSubmit(e) {
  e.preventDefault();

  const submitBtn = document.getElementById("saveProfileBtn");
  const originalText = submitBtn ? submitBtn.innerHTML : "";

  try {
    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
    }

    // Collect form data
    const formData = {
      firstName: document.getElementById("editFirstName")?.value?.trim(),
      lastName: document.getElementById("editLastName")?.value?.trim(),
      age: document.getElementById("editAge")?.value
        ? parseInt(document.getElementById("editAge").value)
        : null,
      gender: document.getElementById("editGender")?.value,
      number: document.getElementById("editNumber")?.value?.trim(),
      bloodType: document.getElementById("editBloodType")?.value,
      division: document.getElementById("editDivision")?.value,
      district: document.getElementById("editDistrict")?.value,
      upazila: document.getElementById("editUpazila")?.value,
      weight: document.getElementById("editWeight")?.value
        ? parseFloat(document.getElementById("editWeight").value)
        : null,
      bio: document.getElementById("editBio")?.value?.trim(),
      hasMedicalConditions:
        document.getElementById("editHasMedicalConditions")?.checked || false,
    };

    // Build location string from division, district, upazila
    if (formData.upazila && formData.district && formData.division) {
      formData.location = `${formData.upazila}, ${formData.district}, ${formData.division}`;
    } else if (formData.district && formData.division) {
      formData.location = `${formData.district}, ${formData.division}`;
    } else if (formData.division) {
      formData.location = formData.division;
    }

    // Make API call
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile");
    }

    // Success - update current user data and refresh display
    currentUserData = data.user;
    displayProfile(data.user);
    displayProfileCompletion(
      data.user.profileCompletion || 0,
      data.user.missingFields || []
    );

    // Close modal
    closeEditModal();

    // Show success message
    showSuccessMessage("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    showEditFormError(error.message || "Failed to update profile");
  } finally {
    // Restore button state
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
  // Remove any existing success message
  const existingMsg = document.querySelector(".success-toast");
  if (existingMsg) {
    existingMsg.remove();
  }

  // Create success toast
  const toast = document.createElement("div");
  toast.className =
    "success-toast fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center";
  toast.innerHTML = `
    <i class="fas fa-check-circle mr-2"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Show error message in edit form
 */
function showEditFormError(message) {
  // Find or create error container in modal
  const form = document.getElementById("editProfileForm");
  if (!form) return;

  // Remove existing error
  const existingError = form.querySelector(".form-error");
  if (existingError) {
    existingError.remove();
  }

  // Create error message
  const errorDiv = document.createElement("div");
  errorDiv.className =
    "form-error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4";
  errorDiv.innerHTML = `
    <i class="fas fa-exclamation-circle mr-2"></i>
    <span>${message}</span>
  `;

  // Insert at top of form
  form.insertBefore(errorDiv, form.firstChild);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    errorDiv.style.opacity = "0";
    errorDiv.style.transition = "opacity 0.3s ease";
    setTimeout(() => errorDiv.remove(), 300);
  }, 5000);
}
