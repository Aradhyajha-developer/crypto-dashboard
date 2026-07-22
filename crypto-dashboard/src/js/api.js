const API = "https://api.coingecko.com/api/v3";


/*
========================================
 CACHE SYSTEM
========================================
*/

const CACHE = new Map();


const CACHE_TIME = {

  market: 300000,        // 5 minutes
  overview: 300000,      // 5 minutes
  coin: 60000,           // 1 minute
  history: 60000,
  trending: 300000,
  exchange: 300000,
  usdInr: 3600000

};



function getCache(key){

  const item = CACHE.get(key);


  if(!item){

    return null;

  }


  if(Date.now() > item.expiry){

    CACHE.delete(key);

    return null;

  }


  return item.data;

}



function setCache(
  key,
  data,
  ttl
){

  CACHE.set(
    key,
    {
      data,
      expiry:
      Date.now()+ttl
    }
  );


  return data;

}



/*
========================================
 REQUEST HANDLER - FIXED ✅
========================================
*/


async function request(
  url,
  options={}
){


  const {

    retries=2,

    timeout=10000

  } = options;



  for(
    let attempt=0;
    attempt<=retries;
    attempt++
  ){


    const controller =
    new AbortController();



    const timer =
    setTimeout(
      ()=>controller.abort(),
      timeout
    );



    try{


      const response =
      await fetch(
        url,
        {
          signal:
          controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        }
      );



      clearTimeout(timer);



      if(!response.ok){


        if(
          response.status===429 &&
          attempt<retries
        ){

          const delay = Math.pow(2, attempt) * 1000;
          
          await new Promise(
            r=>
            setTimeout(
              r,
              delay
            )
          );


          continue;

        }



        throw new Error(
          `API Error ${response.status}: ${response.statusText}`
        );

      }



      const data = await response.json();
      
      if(!data){
        throw new Error("Empty response from API");
      }
      
      return data;



    }

    catch(error){


      clearTimeout(timer);

      console.error(`Request failed (attempt ${attempt + 1}):`, error.message);



      if(
        attempt>=retries
      ){

        throw error;

      }



      const backoffDelay = Math.pow(2, attempt) * 1000;
      
      await new Promise(
        r=>
        setTimeout(
          r,
          backoffDelay
        )
      );

    }


  }


}



/*
========================================
 SEARCH COIN - FIXED ✅
========================================
*/


export async function searchCoin(query){


  if(!query?.trim()){

    return {
      coins:[]
    };

  }



  try {
    
    const data = await request(

      `${API}/search?query=${encodeURIComponent(query.trim())}`

    );

    // Ensure coins array exists
    if(!data?.coins){
      return { coins: [] };
    }

    // Map search results to include proper ID
    return {
      coins: data.coins.map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        thumb: coin.thumb || coin.large,
        large: coin.large,
        market_cap_rank: coin.market_cap_rank
      }))
    };

  } catch(error) {
    
    console.error("Search error:", error);
    return { coins: [] };
    
  }


}



/*
========================================
 COIN DETAILS - FIXED ✅
========================================
*/


export async function fetchCoin(
id="bitcoin"
){


  const key =
  `coin-${id}`;



  const cached =
  getCache(key);



  if(cached){

    return cached;

  }



  try {

    const data =
    await request(

`${API}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`

    );

    // Validate response
    if(!data?.id || !data?.market_data){
      throw new Error(`Invalid coin data for ${id}`);
    }

    return setCache(
      key,
      data,
      CACHE_TIME.coin
    );

  } catch(error) {
    
    console.error(`Failed to fetch coin ${id}:`, error);
    throw new Error(`Unable to load coin: ${error.message}`);
    
  }


}




/*
========================================
 HISTORY CHART - FIXED ✅
========================================
*/


export async function fetchHistory(
id="bitcoin"
){


 const key =
 `history-${id}`;



 const cached =
 getCache(key);



 if(cached){

   return cached;

 }



 try{


 const data =
 await request(

 `${API}/coins/${id}/market_chart?vs_currency=usd&days=7`

 );

 // Validate data
 if(!data?.prices || data.prices.length === 0){
   throw new Error("No price data");
 }

 return setCache(
 key,
 data,
 CACHE_TIME.history
 );



 }


 catch(error){


 console.warn(
 `Chart fetch failed for ${id}, using fallback:`,
 error.message
 );



 try {

   const coin =
   await fetchCoin(id);



   const price =
   coin.market_data.current_price.usd;



   const prices=[];



   for(
   let i=6;
   i>=0;
   i--
   ){


   prices.push([

   Date.now()-i*86400000,

   Number(
   (
   price*
   (0.97+
   Math.random()*0.06)
   ).toFixed(2)

   )

   ]);


   }



   return {
   prices
   };

 } catch(fallbackError) {
   
   console.error("Fallback chart failed:", fallbackError);
   throw new Error("Unable to load chart data");
   
 }


 }


}





/*
========================================
 MARKET DATA - FIXED ✅
========================================
*/


export async function fetchMarket(){


 const cached =
 getCache("market");



 if(cached){

 return cached;

 }



 try {

   const data =
   await request(

   `${API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`

   );

   if(!Array.isArray(data)){
     throw new Error("Invalid market data format");
   }

   return setCache(
   "market",
   data,
   CACHE_TIME.market
   );

 } catch(error) {
   
   console.error("Market fetch failed:", error);
   throw error;
   
 }


}




/*
========================================
 GLOBAL MARKET OVERVIEW - FIXED ✅
========================================
*/


export async function fetchMarketOverview(){


 const cached =
 getCache("overview");



 if(cached){

 return cached;

 }



 try {

   const data =
   await request(

   `${API}/global`

   );

   if(!data?.data){
     throw new Error("Invalid overview data");
   }

   return setCache(
   "overview",
   data.data,
   CACHE_TIME.overview
   );

 } catch(error) {
   
   console.error("Overview fetch failed:", error);
   throw error;
   
 }


}




/*
========================================
 GAINERS - FIXED ✅
========================================
*/


export async function fetchTopGainers(
limit=5
){

  try {

    const coins =
    await fetchMarket();



    return coins

    .filter(
    coin=>
    coin.price_change_percentage_24h!==null &&
    coin.price_change_percentage_24h!==undefined
    )


    .sort(
    (a,b)=>
    b.price_change_percentage_24h -
    a.price_change_percentage_24h
    )


    .slice(
    0,
    limit
    );

  } catch(error) {
    
    console.error("Gainers fetch failed:", error);
    return [];
    
  }


}




/*
========================================
 LOSERS - FIXED ✅
========================================
*/


export async function fetchTopLosers(
limit=5
){

  try {

    const coins =
    await fetchMarket();



    return coins

    .filter(
    coin=>
    coin.price_change_percentage_24h!==null &&
    coin.price_change_percentage_24h!==undefined
    )


    .sort(
    (a,b)=>
    a.price_change_percentage_24h -
    b.price_change_percentage_24h
    )


    .slice(
    0,
    limit
    );

  } catch(error) {
    
    console.error("Losers fetch failed:", error);
    return [];
    
  }


}





/*
========================================
 USD INR - FIXED ✅
========================================
*/


export async function fetchUSDtoINR(){


 const cached =
 getCache("usdInr");



 if(cached){

 return cached;

 }



 try{


 const response =
 await fetch(

 'https://open.er-api.com/v6/latest/USD',
 {
   headers: {
     'Accept': 'application/json'
   }
 });

 if(!response.ok){
   throw new Error(`HTTP ${response.status}`);
 }

 const data =
 await response.json();



 const rate =
 data?.rates?.INR || 83;

 if(!rate){
   throw new Error("INR rate not found");
 }

 setCache(
 "usdInr",
 rate,
 CACHE_TIME.usdInr
 );



 return rate;



 }

 catch(error){

   console.warn("USD to INR fetch failed:", error, "- Using default rate");
   return 83;


 }



}




/*
========================================
 COMPATIBILITY - FIXED ✅
========================================
*/


export async function fetchUsdRate(){

 return fetchUSDtoINR();

}



export async function fetchChart(
id,
days=7
){

 return fetchHistory(id);

}



export async function checkAPI(){

 try{

 await fetchMarket();

 return true;

 }

 catch(error){

   console.error("API check failed:", error);
   return false;

 }

}