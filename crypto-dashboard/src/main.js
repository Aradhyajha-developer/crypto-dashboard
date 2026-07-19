// CSS Imports

import "./css/base.css";
import "./css/layout.css";
import "./css/components.css";
import "./css/dashboard.css";
import "./css/responsive.css";


// Components

import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import Home from "./pages/Home.js";


// JS Modules

import "./js/dashboard.js";
import "./js/chart.js";
import "./js/market.js";
import "./js/converter.js";
import "./js/theme.js";




// App Container

const app = document.getElementById("app");



// Render Application

app.innerHTML = `

${Header()}

${Home()}

${Footer()}

`;




// Theme Setup

const themeBtn = document.getElementById("themeBtn");



// Load Saved Theme

const savedTheme = localStorage.getItem("theme");


if(savedTheme === "dark"){

document.body.classList.add("dark");

}





// Theme Toggle

themeBtn?.addEventListener("click",()=>{


document.body.classList.toggle("dark");



const currentTheme =

document.body.classList.contains("dark")

?
"dark"

:
"light";



localStorage.setItem(
"theme",
currentTheme
);



});