let initialized = false;

/*
================================
HELPERS
================================
*/

function getSavedTheme() {
  return localStorage.getItem("theme");
}

function getPreferredTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function isDark() {
  return document.body.classList.contains("dark");
}

function updateButton(btn) {
  if (!btn) return;

  btn.textContent = isDark() ? "☀️" : "🌙";

  btn.title = isDark()
    ? "Switch to Light Mode"
    : "Switch to Dark Mode";
}

function applyTheme(theme) {
  document.body.classList.toggle(
    "dark",
    theme === "dark"
  );

  localStorage.setItem("theme", theme);
}

/*
================================
INITIALIZE THEME
================================
*/

export function initializeTheme() {
  if (initialized) return;

  initialized = true;

  const themeBtn =
    document.getElementById("themeBtn");

  const savedTheme =
    getSavedTheme() || getPreferredTheme();

  applyTheme(savedTheme);

  updateButton(themeBtn);

  if (!themeBtn) {
    console.warn("Theme button not found.");
    return;
  }

  themeBtn.addEventListener("click", () => {
    const nextTheme = isDark()
      ? "light"
      : "dark";

    applyTheme(nextTheme);

    updateButton(themeBtn);
  });
}

/*
================================
TOGGLE PROGRAMMATICALLY
================================
*/

export function toggleTheme() {
  const nextTheme = isDark()
    ? "light"
    : "dark";

  applyTheme(nextTheme);

  updateButton(
    document.getElementById("themeBtn")
  );
}

/*
================================
GET CURRENT THEME
================================
*/

export function getCurrentTheme() {
  return isDark() ? "dark" : "light";
}