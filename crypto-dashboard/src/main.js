import "./css/base.css";
import "./css/layout.css";
import "./css/components.css";
import "./css/dashboard.css";
import "./css/responsive.css";


import Header from "./components/Header.js";
import Footer from "./components/Footer.js";

import Home from "./pages/Home.js";


import {
    initDashboard
} from "./js/dashboard.js";



/* ==========================
   APP ROOT
========================== */


const app =
document.getElementById("app");



if(app){


app.innerHTML = `

${Header()}

${Home()}

${Footer()}

`;



}





/* ==========================
   START APP
========================== */


window.addEventListener(

"DOMContentLoaded",

()=>{


    initDashboard();


}

);