const mockExtensions = [
  {
    id: 1,
    name: "AdBlock Plus",
    version: "3.15.1",
    description:
      "Block ads and trackers across the web for a faster, cleaner browsing experience.",
    isActive: "true",
    icon: "AB",
  },
  {
    id: 2,
    name: "LastPass",
    version: "4.95.0",
    description:
      "Secure password manager and digital vault for all your online accounts.",
    isActive: "true",
    icon: "LP",
  },
  {
    id: 3,
    name: "React Developer Tools",
    version: "4.25.0",
    description: "Debug React components and inspect the virtual DOM tree.",
    isActive: "false",
    icon: "RD",
  },
  {
    id: 4,
    name: "Grammarly",
    version: "14.1057.0",
    description:
      "AI-powered writing assistant that helps you write clearly and effectively.",
    isActive: "true",
    icon: "GR",
  },
  {
    id: 5,
    name: "ColorZilla",
    version: "3.5.4",
    description:
      "Advanced eyedropper, color picker, gradient generator and color analyzer.",
    isActive: "false",
    icon: "CZ",
  },
  {
    id: 6,
    name: "JSON Formatter",
    version: "0.7.1",
    description:
      "Format and validate JSON data with syntax highlighting and collapsible nodes.",
    isActive: "true",
    icon: "JS",
  },
];

// Global app state
const appState = {
  extensions: [],
  currentFilter: "all",
  isDarkMode: localStorage.getItem("darkMode") === "true",
};

const serverURL = "http://localhost:3000/extensions";

// Get extensions from server
async function fetchExtensions() {
  const loading = document.getElementById("loading");

  try {
    loading.style.display = "flex";

    // Try to fetch from server first
    const response = await fetch(serverURL);
    const data = await response.json();
    appState.extensions = data;
  } catch (error) {
    console.warn("Server not available, using mock data:", error);
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    appState.extensions = mockExtensions;
  }

  loading.style.display = "none";
  renderExtensions();
}

// Display extensions
function renderExtensions() {
  const mainContent = document.querySelector(".main-container");
  const filteredExtensions = filterExtensions(
    appState.extensions,
    appState.currentFilter
  );

  if (filteredExtensions.length === 0) {
    mainContent.innerHTML = `
      <div class="empty-state">
        <h3>No extensions found</h3>
        <p>No extensions match the current filter criteria.</p>
      </div>
    `;

    return;
  }

  const extensionsGrid = document.createElement("div");
  extensionsGrid.className = "extensions-grid";

  extensionsGrid.innerHTML = filteredExtensions
    .map(
      (extension) => `
      <div class="extensions-card" data-id="${extension.id}">
        <div class="extension-header flex">
          <img src="${extension.logo}" class="extension-icon" />

          <div class="extension-details">
            <h3>${extension.name}</h3>
            <p>${extension.description}</p>
          </div>
        </div>

        <div class="extension-buttons flex">
          <button class="remove-btn" data-id="${extension.id}">Remove</button>
          

            <label class="switch">
              <input type="checkbox" ${
                extension.isActive ? "checked" : ""
              } data-id="${extension.id}" class="toggle-extension" />
            <span class="slider"></span>
          </label>
        </div>
      </div>`
    )
    .join("");

  mainContent.innerHTML = "";
  mainContent.appendChild(extensionsGrid);

  // Add event listeners for the newly created elements
  setupExtensionEventListeners();
}

function filterExtensions(extensions, filter) {
  if (filter === "all") return extensions;

  // Convert filter to boolean for comparison
  if (filter === "active") {
    return extensions.filter((extension) => extension.isActive === true);
  } else if (filter === "inactive") {
    return extensions.filter((extension) => extension.isActive === false);
  }

  return extensions;
}

function handleFilterChange(clickedLink) {
  // Update active filter link
  document.querySelectorAll(".filter-link").forEach((link) => {
    link.classList.remove("active");
  });
  clickedLink.classList.add("active");

  // Update current filter and re-render
  appState.currentFilter = clickedLink.dataset.filter;
  renderExtensions();
}

function handleThemeToggle() {
  appState.isDarkMode = !appState.isDarkMode;
  localStorage.setItem("darkMode", appState.isDarkMode.toString());

  if (appState.isDarkMode) {
    document.body.setAttribute("data-theme", "dark");
    document.getElementById("themeIcon").src = "./images/icon-sun.svg";
  } else {
    document.body.removeAttribute("data-theme");
    document.getElementById("themeIcon").src = "./images/icon-moon.svg";
  }
}

// Setup theme on load
function setupTheme() {
  if (appState.isDarkMode) {
    document.body.setAttribute("data-theme", "dark");
    document.getElementById("themeIcon").src = "./images/icon-sun.svg";
  } else {
    document.body.removeAttribute("data-theme");
    document.getElementById("themeIcon").src = "./images/icon-moon.svg";
  }
}

// Toggle extension active state
function toggleExtension(extensionId) {
  const extension = appState.extensions.find(
    (extension) => extension.id === parseInt(extensionId)
  );
  if (extension) {
    extension.isActive = !extension.isActive;
    renderExtensions();
  }
}

// Remove extension
function removeExtension(extensionId) {
  appState.extensions = appState.extensions.filter(
    (extension) => extension.id !== parseInt(extensionId)
  );
  renderExtensions();
}

// Setup event listeners for extensions (remove and toggle)
function setupExtensionEventListeners() {
  // Remove buttons
  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const extensionId = e.target.dataset.id;
      removeExtension(extensionId);
    });
  });

  // Toggle switches
  document.querySelectorAll(".toggle-extension").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const extensionId = e.target.dataset.id;
      toggleExtension(extensionId);
      console.log(appState.extensions);
    });
  });
}

// Setup event listeners for extensions
function setupEventListeners() {
  // Filter links
  const filterLinks = document.querySelectorAll(".filter-link");
  filterLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      handleFilterChange(e.target);
    });
  });

  // Theme toggle
  document
    .getElementById("themeIcon")
    .addEventListener("click", handleThemeToggle);
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  setupTheme();
  fetchExtensions();
});
