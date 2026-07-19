const btn = document.getElementById("themeBtn");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

btn?.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  const currentTheme = document.body.classList.contains("dark")
    ? "dark"
    : "light";

  localStorage.setItem("theme", currentTheme);

});