import { 
  fetchCoin, 
  fetchHistory,
  searchCoins 
} from "./api.js";


import { renderChart } from "./chart.js";


import {
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorite
} from "./storage.js";


import { fetchMarket } from "./market.js";


import { convertUSD } from "./currency.js";


import {
  showLoader,
  hideLoader
} from "../components/Loader.js";




window.addEventListener(
"DOMContentLoaded",
()=>{


const searchInput =
document.getElementById("search");


const searchBtn =
document.getElementById("searchBtn");


const coinData =
document.getElementById("coinData");


const suggestions =
document.getElementById("suggestions");


const usdInput =
document.getElementById("usd");


const inrOutput =
document.getElementById("inr");



renderFavorites();

loadMarket();





// SEARCH BUTTON


searchBtn.addEventListener(
"click",
loadCoin
);





// ENTER SEARCH


searchInput.addEventListener(
"keydown",
(e)=>{


if(e.key==="Enter"){

loadCoin();

}


});







// SEARCH SUGGESTIONS


searchInput.addEventListener(
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
data-id="${coin.id}"
>


<img 
src="${coin.thumb}"
>


<span>

${coin.name}

(${coin.symbol.toUpperCase()})

</span>


</div>


`
)
.join("");






document
.querySelectorAll(".suggestion")
.forEach(item=>{


item.addEventListener(
"click",
()=>{


searchInput.value =
item.dataset.id;


suggestions.innerHTML="";


loadCoin();


});


});



}

catch(error){


suggestions.innerHTML="";


}



});









// LOAD COIN FUNCTION


async function loadCoin(){



const coin =
searchInput.value
.trim()
.toLowerCase();



if(!coin){


coinData.innerHTML = `

<div class="error-card">

<p>
Please enter coin name
</p>

</div>

`;


return;


}





try{


showLoader();



const data =
await fetchCoin(coin);



hideLoader();





coinData.innerHTML = `


<div class="card">


<img 
src="${data.image.small}"
alt="${data.name}"
>



<h2>

${data.name}

(${data.symbol.toUpperCase()})

</h2>




<p>

<strong>
Price:
</strong>

$${data.market_data.current_price.usd}

</p>



<p>

<strong>
24h Change:
</strong>

${data.market_data.price_change_percentage_24h.toFixed(2)}%

</p>




<p>

<strong>
Market Cap:
</strong>

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







const favoriteBtn =
document.getElementById("favoriteBtn");



favoriteBtn.addEventListener(
"click",
()=>{


addFavorite(data.id);


renderFavorites();


favoriteBtn.innerHTML =
"❤️ Saved";


});






const history =
await fetchHistory(coin);



renderChart(
history,
data.name
);





}


catch(error){



hideLoader();



coinData.innerHTML = `


<div class="error-card">


<h3>
❌ Coin Not Found
</h3>


<p>
Enter valid cryptocurrency name
</p>


</div>


`;



}


}








// USD TO INR



usdInput.addEventListener(
"input",
async()=>{


const value =
usdInput.value;



if(!value){


inrOutput.innerHTML =
"₹0";


return;


}



const inr =
await convertUSD(value);



inrOutput.innerHTML =
`₹ ${inr.toFixed(2)}`;



});





});












// FAVORITES


function renderFavorites(){


const list =
document.getElementById("favorites");



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


<span>

${coin}

</span>



<button 
class="removeBtn"
data-id="${coin}"
>

❌

</button>


</li>

`
)
.join("");







document
.querySelectorAll(".removeBtn")
.forEach(btn=>{


btn.addEventListener(
"click",
()=>{


removeFavorite(
btn.dataset.id
);


renderFavorites();


});


});



}









// MARKET WIDGET


async function loadMarket(){



try{


const data =
await fetchMarket();





const gainers =

[...data]
.sort(
(a,b)=>
b.price_change_percentage_24h -
a.price_change_percentage_24h
)
.slice(0,5);






const losers =

[...data]
.sort(
(a,b)=>
a.price_change_percentage_24h -
b.price_change_percentage_24h
)
.slice(0,5);







document
.getElementById("gainers")
.innerHTML =


gainers.map(
coin=>`

<p class="gain">

🟢 ${coin.name}

${coin.price_change_percentage_24h.toFixed(2)}%

</p>

`
)
.join("");







document
.getElementById("losers")
.innerHTML =


losers.map(
coin=>`

<p class="loss">

🔴 ${coin.name}

${coin.price_change_percentage_24h.toFixed(2)}%

</p>

`
)
.join("");




}



catch(error){


document
.getElementById("gainers")
.innerHTML =
"Unable to load";



document
.getElementById("losers")
.innerHTML =
"Unable to load";



}



}