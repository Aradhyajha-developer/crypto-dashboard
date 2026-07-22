let initialized = false;


/*
================================
HELPERS
================================
*/


function getSavedTheme(){

return localStorage.getItem(
"theme"
);

}



function getPreferredTheme(){

return window.matchMedia(
"(prefers-color-scheme: dark)"
)
.matches
?
"dark"
:
"light";

}



function isDark(){

return document.body.classList.contains(
"dark"
);

}





function updateButton(btn){

if(!btn) return;


btn.textContent =
isDark()
?
"☀️"
:
"🌙";



btn.setAttribute(
"title",
isDark()
?
"Switch to Light Mode"
:
"Switch to Dark Mode"
);


}





function applyTheme(theme){


document.body.classList.toggle(
"dark",
theme==="dark"
);



localStorage.setItem(
"theme",
theme
);


}





/*
================================
INITIALIZE
================================
*/


export function initializeTheme(){


if(initialized)
return;


initialized=true;



const saved =
getSavedTheme();



const theme =
saved ||
getPreferredTheme();



applyTheme(theme);



const themeBtn =
document.getElementById(
"themeBtn"
);



updateButton(themeBtn);



if(themeBtn){


themeBtn.addEventListener(
"click",
()=>{


const next =
isDark()
?
"light"
:
"dark";



applyTheme(next);



updateButton(
themeBtn
);



}
);


}



}







/*
================================
TOGGLE
================================
*/


export function toggleTheme(){


const next =
isDark()
?
"light"
:
"dark";



applyTheme(next);



updateButton(
document.getElementById(
"themeBtn"
)
);


}







/*
================================
GET CURRENT
================================
*/


export function getCurrentTheme(){

return isDark()
?
"dark"
:
"light";

}