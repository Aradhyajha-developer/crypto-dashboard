import Home from "../pages/Home.js";
import About from "../pages/About.js";
import Favorites from "../pages/favorites.js";
import { initDashboard } from "./dashboard.js";

const routes = {
  "#home": Home,
  "#about": About,
  "#favorites": Favorites,
};

let routerInitialized = false;

export function renderRoute() {
  const page = document.getElementById("page-content");

  if (!page) return;

  const hash = window.location.hash || "#home";
  const safeHash = hash.startsWith("#") ? hash : `#${hash}`;
  const Component = routes[safeHash] || Home;

  page.innerHTML = Component();

  if (safeHash === "#home") {
    initDashboard();
  }
}

export function initializeRouter() {
  if (routerInitialized) return;

  routerInitialized = true;

  window.addEventListener("hashchange", renderRoute);
  renderRoute();
}