import "./css/base.css";
import "./css/layout.css";
import "./css/components.css";
import "./css/dashboard.css";
import "./css/responsive.css";
import "./js/theme.js";
import "./js/converter.js";
import "./js/dashboard.js";


import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { Home } from "./pages/Home.js";

document.querySelector("#app").innerHTML = `
${Header()}
${Home()}
${Footer()}
`;