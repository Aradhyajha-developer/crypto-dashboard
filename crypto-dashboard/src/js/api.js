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
 REQUEST HANDLER
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
          controller.signal
        }
      );



      clearTimeout(timer);



      if(!response.ok){


        if(
          response.status===429 &&
          attempt<retries
        ){

          await new Promise(
            r=>
            setTimeout(
              r,
              2000
            )
          );


          continue;

        }



        throw new Error(
          `API Error ${response.status}`
        );

      }



      return await response.json();



    }

    catch(error){


      clearTimeout(timer);



      if(
        attempt>=retries
      ){

        throw error;

      }



      await new Promise(
        r=>
        setTimeout(
          r,
          1000
        )
      );

    }


  }


}



/*
========================================
 SEARCH COIN
========================================
*/


export async function searchCoin(query){


  if(!query?.trim()){

    return {
      coins:[]
    };

  }



  return request(

    `${API}/search?query=${encodeURIComponent(query.trim())}`

  );


}



/*
========================================
 COIN DETAILS
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



  const data =
  await request(

`${API}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`

  );



  return setCache(
    key,
    data,
    CACHE_TIME.coin
  );


}




/*
========================================
 HISTORY CHART
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



 return setCache(
 key,
 data,
 CACHE_TIME.history
 );



 }


 catch(error){


 console.warn(
 "Using fallback chart"
 );



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


 }


}





/*
========================================
 MARKET DATA
========================================
*/


export async function fetchMarket(){


 const cached =
 getCache("market");



 if(cached){

 return cached;

 }



 const data =
 await request(

 `${API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`

 );



 return setCache(
 "market",
 data,
 CACHE_TIME.market
 );


}




/*
========================================
 GLOBAL MARKET OVERVIEW
========================================
*/


export async function fetchMarketOverview(){


 const cached =
 getCache("overview");



 if(cached){

 return cached;

 }



 const data =
 await request(

 `${API}/global`

 );



 return setCache(
 "overview",
 data.data,
 CACHE_TIME.overview
 );


}




/*
========================================
 GAINERS
========================================
*/


export async function fetchTopGainers(
limit=5
){


 const coins =
 await fetchMarket();



 return coins

 .filter(
 coin=>
 coin.price_change_percentage_24h!==null
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


}




/*
========================================
 LOSERS
========================================
*/


export async function fetchTopLosers(
limit=5
){


 const coins =
 await fetchMarket();



 return coins

 .filter(
 coin=>
 coin.price_change_percentage_24h!==null
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


}





/*
========================================
 USD INR
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

 "https://open.er-api.com/v6/latest/USD"

 );



 const data =
 await response.json();



 const rate =
 data?.rates?.INR || 83;



 setCache(
 "usdInr",
 rate,
 CACHE_TIME.usdInr
 );



 return rate;



 }

 catch{


 return 83;


 }



}




/*
========================================
 COMPATIBILITY
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

 catch{

 return false;

 }

}