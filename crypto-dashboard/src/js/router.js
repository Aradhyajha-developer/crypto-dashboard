import Home from "./pages/Home.js";
import About from "./pages/About.js";
import Favorites from "./pages/Favorites.js";

const routes = {
  "#home": Home,
  "#about": About,
  "#favorites": Favorites,
};

export function renderRoute() {
  const appContent = document.getElementById("page-content");

  if (!appContent) return;

  const hash = window.location.hash || "#home";

  const Page = routes[hash] || Home;

  appContent.innerHTML = Page();
}

export function initializeRouter() {
  window.addEventListener("hashchange", renderRoute);

  renderRoute();
}