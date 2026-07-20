import Home from "../pages/Home.js";
import About from "../pages/About.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const routes = {
  "/": Home,
  "/about": About
};

export function router() {
  const app = document.getElementById("app");
  if (!app) return;

  const path = window.location.pathname;
  const page = routes[path] || Home;

  app.innerHTML = `${Header()}${page()}${Footer()}`;
  setActiveLink(path);
  document.dispatchEvent(new CustomEvent("app:rendered", { detail: { path } }));
}

export function navigate(url) {
  window.history.pushState({}, "", url);
  router();
}

function setActiveLink(path) {
  document.querySelectorAll("[data-link]").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === path) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("popstate", router);

document.addEventListener("click", (event) => {
  const target = event.target;
  const link = target instanceof Element ? target.closest("[data-link]") : null;
  if (!link) return;

  event.preventDefault();
  navigate(link.getAttribute("href"));
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", router);
} else {
  router();
}
