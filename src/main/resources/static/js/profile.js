/**
 * Blood Donation Management System - Profile Page Handler
 * Handles profile display and updates
 */

document.addEventListener("DOMContentLoaded", function () {
  loadProfile();
});

/**
 * Load user profile data
 */
async function loadProfile() {
  try {
    const data = await api.getProfile();

    if (data.user) {
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
  const nameEl = document.querySelector("h2.text-2xl");
  if (nameEl) {
    nameEl.textContent = `${user.firstName} ${user.lastName}`;
  }

  // Blood type
  const bloodTypeEl = document.querySelector("p.text-red-600");
  if (bloodTypeEl) {
    bloodTypeEl.textContent = `${user.bloodType} Blood Group`;
  }

  // Profile details
  setTextContent('[data-field="age"]', user.age);
  setTextContent('[data-field="gender"]', user.gender);
  setTextContent(
    '[data-field="lastDonationDate"]',
    formatDate(user.lastDonationDate)
  );
  setTextContent('[data-field="location"]', user.location);

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
