import { 
fetchCoin,
fetchHistory,
searchCoins
}
from "./api.js";


import { renderChart }
from "./chart.js";


import {
addFavorite,
removeFavorite,
getFavorites,
isFavorite
}
from "./storage.js";


import { fetchMarket }
from "./market.js";


import { convertUSD }
from "./currency.js";


import {
showLoader,
hideLoader
}
from "../components/loader.js";




window.addEventListener(
"DOMContentLoaded",
()=>{


const searchInput =
document.getElementById("search");


const searchBtn =
document.getElementById("searchBtn");


const coinData =
document.getElementById("results");


const usdInput =
document.getElementById("usd");


const inrOutput =
document.getElementById("inr");


const suggestions =
document.getElementById("suggestions");
const spinner =
document.getElementById("loader");



renderFavorites();

loadMarket();




searchBtn?.addEventListener(
"click",
loadCoin
);



searchInput?.addEventListener(
"keydown",
(e)=>{

if(e.key==="Enter"){

loadCoin();

}

});




// Search Suggestion


searchInput?.addEventListener(
"input",
async()=>{


const value =
searchInput.value.trim();



if(value.length < 2){

suggestions.innerHTML="";

return;

}



try{


const data =
await searchCoins(value);



suggestions.innerHTML =

data.coins
.slice(0,5)
.map(
coin=>`

<div 
class="suggestion"
data-id="${coin.id}">

<img src="${coin.thumb}">

${coin.name}

</div>

`
)
.join("");



document
.querySelectorAll(".suggestion")
.forEach(item=>{


item.onclick=()=>{

searchInput.value =
item.dataset.id;


suggestions.innerHTML="";


loadCoin();

};


});


}

catch{

suggestions.innerHTML="";

}



});






async function loadCoin(){


const coin =
searchInput.value
.trim()
.toLowerCase();



if(!coin)return;



try{


showLoader();



const data =
await fetchCoin(coin);



hideLoader();



coinData.innerHTML = `


<div class="card">


<img 
src="${data.image.small}"
>


<h2>

${data.name}

(${data.symbol.toUpperCase()})

</h2>



<p>

Price:
$${data.market_data.current_price.usd}

</p>



<p>

24h:
${data.market_data.price_change_percentage_24h.toFixed(2)}%

</p>



<p>

Market Cap:
$${data.market_data.market_cap.usd.toLocaleString()}

</p>



<button id="favoriteBtn">

${
isFavorite(data.id)
?
"❤️ Saved"
:
"🤍 Add Favorite"

}

</button>


</div>


`;



document
.getElementById("favoriteBtn")
.onclick=()=>{


addFavorite(data.id);


renderFavorites();


};



const history =
await fetchHistory(coin);



renderChart(
history,
data.name
);



}


catch{


hideLoader();



coinData.innerHTML=`

<div class="error-card">

<h3>
❌ Coin Not Found
</h3>

</div>

`;

}


}







// USD INR


if(usdInput){


usdInput.addEventListener(
"input",
async()=>{


const value =
usdInput.value;


if(!value){

inrOutput.innerHTML="₹0";

return;

}



const inr =
await convertUSD(value);



inrOutput.innerHTML =
`₹ ${inr.toFixed(2)}`;


});

}






});







function renderFavorites(){


const list =
document.getElementById("favList");



if(!list)return;



const favorites =
getFavorites();



if(!favorites.length){

list.innerHTML =
"<li>No favorites yet</li>";

return;

}



list.innerHTML =

favorites.map(
coin=>`

<li class="favorite-item">

${coin}

<button 
class="removeBtn"
data-id="${coin}">

❌

</button>


</li>

`
)
.join("");




document
.querySelectorAll(".removeBtn")
.forEach(btn=>{


btn.onclick=()=>{


removeFavorite(
btn.dataset.id
);


renderFavorites();


};


});


}







async function loadMarket(){


try{


const data =
await fetchMarket();



document.getElementById("gainers")
.innerHTML =

data
.sort(
(a,b)=>
b.price_change_percentage_24h -
a.price_change_percentage_24h
)
.slice(0,5)
.map(
coin=>`

<p class="gain">

🟢 ${coin.name}
${coin.price_change_percentage_24h.toFixed(2)}%

</p>

`
)
.join("");



document.getElementById("losers")
.innerHTML =

data
.sort(
(a,b)=>
a.price_change_percentage_24h -
b.price_change_percentage_24h
)
.slice(0,5)
.map(
coin=>`

<p class="loss">

🔴 ${coin.name}
${coin.price_change_percentage_24h.toFixed(2)}%

</p>

`
)
.join("");



}

catch{


console.log(
"Market loading failed"
);


}


}