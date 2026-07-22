import {
  fetchMarketOverview,
  fetchTopGainers,
  fetchTopLosers
} from "./api.js";


import {
  formatCurrency,
  formatPercent,
  showError
} from "./utils.js";



/*
========================================
HELPERS
========================================
*/


function getElement(id){

  return document.getElementById(id);

}



function setText(id,value){

  const element =
  getElement(id);


  if(element){

    element.textContent=value;

  }

}




function setLoading(id){

  const element =
  getElement(id);


  if(element){

    element.innerHTML = `
      <p class="loading-text">
        Loading...
      </p>
    `;

  }

}



function clearElement(id){

  const element =
  getElement(id);


  if(element){

    element.innerHTML="";

  }

}




/*
========================================
 MARKET OVERVIEW
========================================
*/


export async function loadMarketOverview(){


  try{


    const market =
    await fetchMarketOverview();



    setText(

      "marketCap",

      formatCurrency(
        market?.total_market_cap?.usd || 0
      )

    );



    setText(

      "marketVolume",

      formatCurrency(
        market?.total_volume?.usd || 0
      )

    );



    setText(

      "btcDom",

      formatPercent(
        market?.market_cap_percentage?.btc || 0
      )

    );



    setText(

      "ethDom",

      formatPercent(
        market?.market_cap_percentage?.eth || 0
      )

    );



  }

  catch(error){


    console.error(
      "Market overview error:",
      error
    );



    setText(
      "marketCap",
      "--"
    );


    setText(
      "marketVolume",
      "--"
    );


    setText(
      "btcDom",
      "--"
    );


    setText(
      "ethDom",
      "--"
    );


  }


}






/*
========================================
 COIN LIST RENDER
========================================
*/


function renderCoins(
elementId,
coins
){


 const list =
 getElement(elementId);



 if(!list){

   return;

 }



 list.innerHTML="";




 if(
 !coins ||
 coins.length===0
 ){

   list.innerHTML=`

   <p class="empty-state">
     No data available
   </p>

   `;


   return;

 }





 const fragment =
 document.createDocumentFragment();




 coins.forEach(
 coin=>{


 const li =
 document.createElement("li");



 const change =
 Number(
 coin.price_change_percentage_24h || 0
 );




 li.className =
 "market-coin";



 li.innerHTML = `


<div class="coin-row">


<div class="coin-info">


<img

src="${
coin.image ||
'./placeholder.png'
}"

alt="${coin.name}"

width="35"

height="35"

loading="lazy"

/>



<div>

<strong>

${coin.name}

</strong>


<small>

${coin.symbol?.toUpperCase() || ""}

</small>


</div>


</div>




<div class="coin-data">


<strong>

${formatCurrency(
coin.current_price
)}

</strong>


<span

class="${
change >=0
?
"positive"
:
"negative"
}"

>


${
change>=0
?
"+"
:
""
}

${change.toFixed(2)}%


</span>


</div>


</div>


`;



 fragment.appendChild(li);



 });



 list.appendChild(fragment);



}







/*
========================================
 TOP GAINERS
========================================
*/


export async function loadTopGainers(){


 setLoading(
 "gainers"
 );



 try{


 const coins =
 await fetchTopGainers(5);



 renderCoins(
 "gainers",
 coins
 );



 }


 catch(error){


 console.error(
 "Gainers error:",
 error
 );


 const element =
 getElement("gainers");



 if(element){

 element.innerHTML=`

 <p class="error-text">

 Unable to load Top Gainers

 </p>

 `;

 }


 }


}







/*
========================================
 TOP LOSERS
========================================
*/


export async function loadTopLosers(){


 setLoading(
 "losers"
 );



 try{


 const coins =
 await fetchTopLosers(5);



 renderCoins(
 "losers",
 coins
 );



 }


 catch(error){


 console.error(
 "Losers error:",
 error
 );


 const element =
 getElement("losers");



 if(element){

 element.innerHTML=`

 <p class="error-text">

 Unable to load Top Losers

 </p>

 `;

 }


 }


}







/*
========================================
 LOAD ALL WIDGETS
========================================
*/


export async function loadMarketWidgets(){



 try{


 // First load overview

 await loadMarketOverview();



 // small delay to protect API

 await new Promise(
 resolve=>
 setTimeout(
 resolve,
 700
 )
 );




 await loadTopGainers();




 await new Promise(
 resolve=>
 setTimeout(
 resolve,
 700
 )
 );




 await loadTopLosers();



 }


 catch(error){


 console.error(
 "Market widgets failed:",
 error
 );


 }


}







/*
========================================
 REFRESH
========================================
*/


export async function refreshMarketWidgets(){

 return loadMarketWidgets();

}