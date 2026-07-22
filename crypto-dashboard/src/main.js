import "./css/base.css";
import "./css/layout.css";
import "./css/components.css";
import "./css/dashboard.css";
import "./css/responsive.css";

import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import { initializeTheme } from "./js/theme.js";
import { initializeRouter } from "./js/router.js";

const app = document.getElementById("app");

function renderApp() {
  if (!app) {
    console.error("Missing #app container in index.html");
    return;
  }

  app.innerHTML = `
    ${Header()}
    <main id="page-content"></main>
    ${Footer()}
  `;

  initializeTheme();
  initializeRouter();
}

document.addEventListener("DOMContentLoaded", renderApp);