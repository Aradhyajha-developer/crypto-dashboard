import {
  getTheme,
  saveTheme
} from "./storage.js";

const DARK_CLASS = "dark";

/* ---------------- Apply Theme ---------------- */

export function applyTheme(theme) {

  if (theme === "dark") {

    document.body.classList.add(DARK_CLASS);

  } else {

    document.body.classList.remove(DARK_CLASS);

  }

  updateThemeButton(theme);

}

/* ---------------- Update Button ---------------- */

export function updateThemeButton(theme) {

  const button = document.getElementById("themeBtn");

  if (!button) return;

  button.textContent =
    theme === "dark" ? "☀️" : "🌙";

}

/* ---------------- Toggle ---------------- */

export function toggleTheme() {

  const isDark =
    document.body.classList.contains(DARK_CLASS);

  const nextTheme =
    isDark ? "light" : "dark";

  applyTheme(nextTheme);

  saveTheme(nextTheme);

}

/* ---------------- Initialize ---------------- */

export function initializeTheme() {

  const savedTheme = getTheme();

  applyTheme(savedTheme);

  const button =
    document.getElementById("themeBtn");

  if (!button) return;

  button.addEventListener("click", toggleTheme);

}