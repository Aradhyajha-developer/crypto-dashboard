import Home from "../pages/Home.js";
import About from "../pages/About.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";



const routes = {

"/": Home,

"/about": About

};





export function router(){


const app =
document.getElementById("app");



const path =
window.location.pathname;



const page =
routes[path] || Home;



app.innerHTML = `${Header()}${page()}${Footer()}`;
document.dispatchEvent(new CustomEvent("app:rendered", { detail: { path } }));



setActiveLink(path);


}







// SPA navigation

export function navigate(url){


window.history.pushState(
{},
"",
url
);



router();


}







// Navbar active state

function setActiveLink(path){


const links =
document.querySelectorAll("[data-link]");



links.forEach(link=>{


link.classList.remove(
"active"
);



if(
link.getAttribute("href")
=== path
){


link.classList.add(
"active"
);


}



});


}








// Browser back/forward

window.addEventListener(
"popstate",
()=>{


router();


});








// Link click handling

document.addEventListener("click", (event) => {


const target = event.target;
const link = target instanceof Element ? target.closest("[data-link]") : null;



if(!link)
return;



event.preventDefault();



navigate(link.getAttribute("href"));







});