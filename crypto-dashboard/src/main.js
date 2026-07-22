import "./css/base.css";
import "./css/layout.css";
import "./css/components.css";
import "./css/dashboard.css";
import "./css/responsive.css";


import Header from "./components/Header.js";
import Footer from "./components/Footer.js";

import Home from "./pages/Home.js";
import About from "./pages/About.js";


import { initDashboard } from "./js/dashboard.js";
import { initializeTheme } from "./js/theme.js";


const app =
document.getElementById("app");



function renderApp(){


app.innerHTML = `

${Header()}


<main id="page">

${Home()}

</main>


${Footer()}

`;



initializeTheme();

initDashboard();



setupNavigation();


}





function setupNavigation(){


const aboutBtn =
document.getElementById("nav-about");

const homeBtn =
document.getElementById("nav-home");



aboutBtn?.addEventListener(
"click",
(e)=>{


e.preventDefault();


document.getElementById("page")
.innerHTML =
About();



}

);




homeBtn?.addEventListener(
"click",
(e)=>{


e.preventDefault();


document.getElementById("page")
.innerHTML =
Home();


initDashboard();


}

);


}



document.addEventListener(
"DOMContentLoaded",
renderApp
);