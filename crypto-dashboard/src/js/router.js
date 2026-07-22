import Home from "../pages/Home.js";
import About from "../pages/About.js";
import Favorites from "../pages/favorites.js";

const routes = {
  "#home": Home,
  "#about": About,
  "#favorites": Favorites,
};

export function renderRoute() {
  const page = document.getElementById("page-content");

  if (!page) return;

  const hash = window.location.hash || "#home";

  const Component = routes[hash] || Home;

  page.innerHTML = Component();
}

export function initializeRouter() {
  window.addEventListener("hashchange", renderRoute);

  renderRoute();
}