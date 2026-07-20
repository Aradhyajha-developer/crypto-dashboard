import {
  searchCoin,
  fetchCoin,
  fetchHistory
} from "./api.js";


import {
  saveFavorite,
  removeFavorite,
  getFavorites,
  isFavorite
} from "./storage.js";


import {
  createChart,
  destroyChart
} from "./chart.js";


import {
  loadMarketWidgets
} from "./market.js";


import {
  initializeConverter
} from "./converter.js";


import {
  initializeTheme
} from "./theme.js";


import {
  showLoader,
  hideLoader
} from "./loader.js";


import {
  formatCurrency,
  formatNumber,
  formatPercent,
  debounce,
  showError
} from "./utils.js";



/*
--------------------------------
DOM ELEMENTS
--------------------------------
*/


const searchInput =
document.getElementById("search");


const searchBtn =
document.getElementById("searchBtn");


const suggestions =
document.getElementById("suggestions");


const results =
document.getElementById("results");


const favList =
document.getElementById("favList");


const chartCanvas =
document.getElementById("priceChart");



let currentCoin = null;



/*
--------------------------------
INITIALIZE APP
--------------------------------
*/


async function initDashboard(){

  try{

    initializeTheme();


    await loadMarketWidgets();


    await initializeConverter();


    renderFavorites();


    setupSearch();


  }
  catch(error){

    console.error(
      "Dashboard Error:",
      error
    );

  }

}



/*
--------------------------------
SEARCH EVENTS
--------------------------------
*/


function setupSearch(){


if(!searchInput)
return;



searchInput.addEventListener(
"input",

debounce(async(e)=>{


const value =
e.target.value.trim();



if(!value){

suggestions.innerHTML="";

return;

}



await showSuggestions(value);



},400)

);



if(searchBtn){

searchBtn.addEventListener(
"click",

()=>{

const value =
searchInput.value.trim();


if(value){

loadCoin(value);

}


}

);

}



searchInput.addEventListener(
"keypress",

(e)=>{


if(e.key==="Enter"){


const value =
searchInput.value.trim();



if(value){

loadCoin(value);

}


}


}

);


}



/*
--------------------------------
SEARCH SUGGESTIONS
--------------------------------
*/


async function showSuggestions(query){


try{


const coins =
await searchCoin(query);



suggestions.innerHTML="";



coins.slice(0,5)
.forEach(coin=>{


const item =
document.createElement("div");



item.innerHTML=`

<img 
src="${coin.thumb}"
width="25"
/>

${coin.name}
(${coin.symbol.toUpperCase()})

`;



item.onclick=()=>{


loadCoin(
coin.id
);


suggestions.innerHTML="";


};



suggestions.appendChild(item);



});



}

catch(error){

console.log(error);

}


}
/*
--------------------------------
LOAD COIN DATA
--------------------------------
*/

async function loadCoin(id){


try{


showLoader();



const coin =
await fetchCoin(id);



currentCoin = coin;



renderCoin(
coin
);



await loadChart(
coin.id,
coin.name
);



hideLoader();



}

catch(error){


console.error(
"Coin Loading Error:",
error
);



hideLoader();



showError(
results,
"Unable to load coin data. Try another search."
);



}

}



/*
--------------------------------
RENDER COIN DETAILS
--------------------------------
*/


function renderCoin(coin){


const market =
coin.market_data;



const favorite =
isFavorite(
coin.id
);



results.innerHTML = `

<div class="card coin-card">


<img

src="${coin.image.large}"

alt="${coin.name}"

>


<h2>

${coin.name}

(${coin.symbol.toUpperCase()})

</h2>



<div class="price">

${formatCurrency(
market.current_price.usd
)}

</div>



<div class="change 
${market.price_change_percentage_24h >=0
? "positive"
:"negative"}">


${formatPercent(
market.price_change_percentage_24h
)}

</div>




<div class="coin-info-grid">


<div>

<h4>
Market Cap
</h4>

<p>

${formatCurrency(
market.market_cap.usd
)}

</p>

</div>




<div>

<h4>
Volume
</h4>

<p>

${formatCurrency(
market.total_volume.usd
)}

</p>

</div>




<div>

<h4>
Rank
</h4>

<p>

#${coin.market_cap_rank}

</p>

</div>


</div>




<button id="favoriteBtn">


${favorite
?"⭐ Remove Favorite"
:"☆ Add Favorite"}

</button>



</div>

`;



setupFavoriteButton(
coin.id
);



}



/*
--------------------------------
FAVORITE BUTTON
--------------------------------
*/


function setupFavoriteButton(id){


const btn =
document.getElementById(
"favoriteBtn"
);



if(!btn)
return;



btn.addEventListener(
"click",

()=>{


if(isFavorite(id)){


removeFavorite(id);



}

else{


saveFavorite(id);



}



renderFavorites();



if(currentCoin){

renderCoin(
currentCoin
);

}


}

);


}



/*
--------------------------------
LOAD CHART
--------------------------------
*/


async function loadChart(
id,
name
){


try{


const history =
await fetchHistory(id);



if(chartCanvas){


createChart(

chartCanvas,

history,

name

);


}


}

catch(error){


console.error(
"Chart Error",
error
);


destroyChart();


}

}
/*
--------------------------------
RENDER FAVORITES
--------------------------------
*/

async function renderFavorites(){

const favorites =
getFavorites();



if(!favList)
return;



if(
favorites.length === 0
){

favList.innerHTML = `

<li>
No favorites added yet ⭐
</li>

`;

return;

}



favList.innerHTML="";



favorites.forEach(
async(id)=>{


try{


const coin =
await fetchCoin(id);



const li =
document.createElement("li");



li.className =
"favorite-item";



li.innerHTML = `

<div class="favorite-left">


<img

src="${coin.image.small}"

width="30"

>


<span>

${coin.name}

</span>


</div>



<div class="favorite-right">


<strong>

${formatCurrency(
coin.market_data.current_price.usd
)}

</strong>



<button
class="remove-fav"
data-id="${coin.id}"
>

❌

</button>


</div>

`;



favList.appendChild(li);



}

catch(error){


console.log(
"Favorite error",
error
);


}


}

);



}


/*
--------------------------------
REMOVE FAVORITE EVENT
--------------------------------
*/


if(favList){


favList.addEventListener(
"click",

(e)=>{


if(
e.target.classList.contains(
"remove-fav"
)

){


const id =
e.target.dataset.id;



removeFavorite(id);



renderFavorites();


}



}

);


}



/*
--------------------------------
LOAD DEFAULT COIN
--------------------------------
*/


async function loadDefaultCoin(){


try{


await loadCoin(
"bitcoin"
);


}

catch(error){


console.log(error);


}


}



/*
--------------------------------
START APPLICATION
--------------------------------
*/


document.addEventListener(
"DOMContentLoaded",

()=>{


initDashboard();



loadDefaultCoin();



}

);
/*
--------------------------------
SEARCH VALIDATION
--------------------------------
*/

function validateSearch(value){

  if(!value || value.trim()===""){

    showError(
      results,
      "Please enter a coin name."
    );

    return false;

  }

  return true;

}



/*
--------------------------------
IMPROVED SEARCH BUTTON
--------------------------------
*/


if(searchBtn){


searchBtn.addEventListener(

"click",

()=>{


const value =
searchInput.value;



if(
validateSearch(value)
){

loadCoin(value.toLowerCase());

}


}

);


}



/*
--------------------------------
NETWORK STATUS
--------------------------------
*/


function checkNetwork(){


if(!navigator.onLine){


showError(

results,

"No internet connection. Please check your network."

);


return false;


}


return true;


}



window.addEventListener(

"offline",

()=>{


showError(

results,

"You are offline."

);


}

);



window.addEventListener(

"online",

()=>{


console.log(
"Connection restored"
);


}

);




/*
--------------------------------
SAFE API CALL
--------------------------------
*/


async function safeFetch(callback){


try{


if(
!checkNetwork()
){

return null;

}


return await callback();



}

catch(error){


console.error(
error
);



throw error;


}


}




/*
--------------------------------
CACHE CURRENT COIN
--------------------------------
*/


function saveLastCoin(coin){


try{


localStorage.setItem(

"lastCoin",

coin

);


}

catch(error){


console.log(
"Cache error"
);


}


}




function getLastCoin(){


return localStorage.getItem(
"lastCoin"
);


}




/*
--------------------------------
AUTO RESTORE LAST SEARCH
--------------------------------
*/


async function restoreLastCoin(){


const last =
getLastCoin();



if(last){


await loadCoin(last);


}

else{


await loadDefaultCoin();


}


}



/*
--------------------------------
FINAL APP START
--------------------------------
*/


async function startApp(){


try{


initDashboard();



await restoreLastCoin();



}

catch(error){


console.error(
"Application failed",
error
);


}


}


