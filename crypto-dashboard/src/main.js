import "./css/base.css";
import "./css/layout.css";
import "./css/components.css";
import "./css/dashboard.css";
import "./css/responsive.css";


import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import Home from "./pages/Home.js";


const app =
document.getElementById("app");


app.innerHTML = `

${Header()}

${Home()}

${Footer()}

`;


// Dashboard start
import("./js/dashboard.js");