/**
 * Blood Donation Management System - Navbar Handler
 * Dynamically creates and injects navbar into all pages
 */

document.addEventListener("DOMContentLoaded", function () {
  injectNavbar();
  initNavbar();
});

/**
 * Inject the complete navbar HTML into the page
 */
function injectNavbar() {
  // Check if navbar container exists, if not create full navbar
  const existingNav = document.querySelector("nav");

  // If nav already exists with our structure, skip injection
  if (existingNav && existingNav.querySelector(".blood-drop")) {
    return;
  }

  // Create navbar HTML
  const navbarHTML = `
    <nav class="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex justify-between items-center h-16">
          <a href="/homePage" class="flex items-center space-x-2">
            <div class="blood-drop w-8 h-10"></div>
            <span class="text-xl font-bold text-gray-900">BD<span class="text-red-600">MS</span></span>
          </a>

          <div id="navbar" class="hidden md:flex items-center space-x-6"></div>

          <button id="menu-btn" class="md:hidden p-2 text-gray-600 hover:text-gray-900">
            <i class="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>

      <div id="mobile-menu" class="hidden md:hidden bg-white border-t px-4 py-4 space-y-3">
        <!-- Mobile menu items will be populated dynamically -->
      </div>
    </nav>
  `;

  // Add required styles if not present
  if (!document.querySelector("#navbar-styles")) {
    const styles = document.createElement("style");
    styles.id = "navbar-styles";
    styles.textContent = `
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");
      .blood-drop {
        background: linear-gradient(180deg, #ef4444 0%, #b91c1c 100%);
        border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
        position: relative;
      }
      .blood-drop::after {
        content: "";
        position: absolute;
        top: 15px;
        left: 12px;
        width: 15px;
        height: 15px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
      }
    `;
    document.head.appendChild(styles);
  }

  // Remove any existing nav and inject new one at the beginning of body
  if (existingNav) {
    existingNav.remove();
  }
  document.body.insertAdjacentHTML("afterbegin", navbarHTML);
}

/**
 * Initialize navbar with authentication-aware links
 */
async function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  try {
    const response = await fetch("/getUserStatus", {
      credentials: "include",
    });
    const data = await response.json();

    renderNavbar(navbar, data);
    renderMobileMenu(data);
  } catch (error) {
    console.error("Error fetching user status:", error);
    // Render default navbar (logged out state)
    renderNavbar(navbar, { loggedIn: false });
    renderMobileMenu({ loggedIn: false });
  }
}

/**
 * Render desktop navbar links based on login status
 */
function renderNavbar(navbar, data) {
  const linkClass = "text-gray-600 hover:text-red-600 font-medium transition";
  const btnClass =
    "px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition";

  let navbarHtml = "";

  // Common links for all users
  navbarHtml += `<a href="/donorListPage" class="${linkClass}">Find Donors</a>`;
  navbarHtml += `<a href="/formPage" class="${linkClass}">Request Blood</a>`;

  // Dynamic links based on login status
  if (data.loggedIn) {
    // Blood Requests (for donors) with notification badge
    navbarHtml += `<a href="/bloodRequests" class="${linkClass} relative" id="blood-requests-link">
      <i class="fas fa-bell mr-1"></i>Blood Requests
      <span id="request-badge" class="hidden absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"></span>
    </a>`;

    // My Requests (for requesters)
    navbarHtml += `<a href="/myRequests" class="${linkClass} relative" id="my-requests-link">
      <i class="fas fa-list-alt mr-1"></i>My Requests
      <span id="response-badge" class="hidden absolute -top-2 -right-2 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center"></span>
    </a>`;

    navbarHtml += `<a href="/profile" class="${linkClass}">
      <i class="fas fa-user-circle mr-1"></i>${data.username}
    </a>`;
    navbarHtml += `<a href="#" id="logout-btn" class="${btnClass}">
      <i class="fas fa-sign-out-alt mr-1"></i>Logout
    </a>`;

    // Load notification counts after render
    setTimeout(() => loadNotificationCounts(), 100);
  } else {
    navbarHtml += `<a href="/aboutUsPage" class="${linkClass}">About</a>`;
    navbarHtml += `<a href="/login" class="${linkClass}">Login</a>`;
    navbarHtml += `<a href="/signUp" class="${btnClass}">Sign Up</a>`;
  }

  navbar.innerHTML = navbarHtml;

  // Attach logout handler
  attachLogoutHandler();
}

/**
 * Render mobile menu links based on login status
 */
function renderMobileMenu(data) {
  const mobileMenu = document.getElementById("mobile-menu");
  if (!mobileMenu) return;

  const linkClass = "block py-2 text-gray-700 hover:text-red-600 font-medium";
  const btnClass =
    "block py-2 px-4 bg-red-600 text-white rounded-lg text-center font-medium";

  let menuHtml = "";

  // Common links
  menuHtml += `<a href="/donorListPage" class="${linkClass}">Find Donors</a>`;
  menuHtml += `<a href="/formPage" class="${linkClass}">Request Blood</a>`;

  // Dynamic links based on login status
  if (data.loggedIn) {
    menuHtml += `<a href="/bloodRequests" class="${linkClass}">
      <i class="fas fa-bell mr-2"></i>Blood Requests
      <span id="mobile-request-badge" class="hidden ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full"></span>
    </a>`;
    menuHtml += `<a href="/myRequests" class="${linkClass}">
      <i class="fas fa-list-alt mr-2"></i>My Requests
      <span id="mobile-response-badge" class="hidden ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full"></span>
    </a>`;
    menuHtml += `<a href="/donorTablePage" class="${linkClass}">Donor Table</a>`;
    menuHtml += `<a href="/aboutUsPage" class="${linkClass}">About Us</a>`;
    menuHtml += `<a href="/profile" class="${linkClass}">
      <i class="fas fa-user-circle mr-2"></i>Profile (${data.username})
    </a>`;
    menuHtml += `<a href="#" id="mobile-logout-btn" class="${btnClass}">
      <i class="fas fa-sign-out-alt mr-2"></i>Logout
    </a>`;
  } else {
    menuHtml += `<a href="/donorTablePage" class="${linkClass}">Donor Table</a>`;
    menuHtml += `<a href="/aboutUsPage" class="${linkClass}">About Us</a>`;
    menuHtml += `<a href="/login" class="${linkClass}">Login</a>`;
    menuHtml += `<a href="/signUp" class="${btnClass}">Sign Up</a>`;
  }

  mobileMenu.innerHTML = menuHtml;

  // Attach mobile logout handler
  const mobileLogoutBtn = document.getElementById("mobile-logout-btn");
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", handleLogout);
  }
}

/**
 * Attach logout handler to logout button
 */
function attachLogoutHandler() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

/**
 * Handle logout action
 */
async function handleLogout(e) {
  e.preventDefault();
  try {
    if (typeof api !== "undefined" && api.logout) {
      await api.logout();
    } else {
      await fetch("/logout", { method: "POST", credentials: "include" });
    }
    window.location.href = "/homePage";
  } catch (error) {
    console.error("Logout failed:", error);
    window.location.href = "/homePage";
  }
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });
  }
}

// Initialize mobile menu on load
document.addEventListener("DOMContentLoaded", initMobileMenu);

/**
 * Load notification counts for logged-in users
 */
async function loadNotificationCounts() {
  try {
    if (typeof api !== "undefined" && api.getNotificationCount) {
      const data = await api.getNotificationCount();

      // Update desktop badges
      const requestBadge = document.getElementById("request-badge");
      const responseBadge = document.getElementById("response-badge");

      if (requestBadge && data.newRequestsCount > 0) {
        requestBadge.textContent =
          data.newRequestsCount > 9 ? "9+" : data.newRequestsCount;
        requestBadge.classList.remove("hidden");
      }

      if (responseBadge && data.unseenResponsesCount > 0) {
        responseBadge.textContent =
          data.unseenResponsesCount > 9 ? "9+" : data.unseenResponsesCount;
        responseBadge.classList.remove("hidden");
      }

      // Update mobile badges
      const mobileRequestBadge = document.getElementById(
        "mobile-request-badge"
      );
      const mobileResponseBadge = document.getElementById(
        "mobile-response-badge"
      );

      if (mobileRequestBadge && data.newRequestsCount > 0) {
        mobileRequestBadge.textContent = data.newRequestsCount;
        mobileRequestBadge.classList.remove("hidden");
      }

      if (mobileResponseBadge && data.unseenResponsesCount > 0) {
        mobileResponseBadge.textContent = data.unseenResponsesCount;
        mobileResponseBadge.classList.remove("hidden");
      }
    }
  } catch (error) {
    console.error("Error loading notification counts:", error);
  }
}

// Refresh notifications periodically (every 60 seconds)
setInterval(() => {
  const navbar = document.getElementById("navbar");
  if (navbar && navbar.querySelector("#request-badge")) {
    loadNotificationCounts();
  }
}, 60000);
