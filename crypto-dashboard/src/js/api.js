const API = "https://api.coingecko.com/api/v3";



/*
================================
COMMON REQUEST HANDLER
================================
*/

async function request(url){

    const response = await fetch(url);


    if(!response.ok){

        throw new Error(
            `API Error: ${response.status}`
        );

    }


    return await response.json();

}





/*
================================
SEARCH COIN
================================
*/

export async function searchCoin(query){

    if(!query || !query.trim()){

        return {
            coins:[]
        };

    }


    return request(
        `${API}/search?query=${encodeURIComponent(query.trim())}`
    );

}





/*
================================
FETCH SINGLE COIN
================================
*/

export async function fetchCoin(
    id="bitcoin"
){

    return request(

        `${API}/coins/${id}?` +
        `localization=false&` +
        `tickers=false&` +
        `market_data=true&` +
        `community_data=false&` +
        `developer_data=false&` +
        `sparkline=false`

    );

}





/*
================================
FETCH PRICE HISTORY
================================
*/

export async function fetchHistory(
    id="bitcoin"
){

    return request(

        `${API}/coins/${id}/market_chart?`+
        `vs_currency=usd&days=7&interval=daily`

    );

}





/*
================================
MARKET COINS
================================
*/

export async function fetchMarket(){

    return request(

        `${API}/coins/markets?`+
        `vs_currency=usd&`+
        `order=market_cap_desc&`+
        `per_page=100&`+
        `page=1&`+
        `sparkline=false&`+
        `price_change_percentage=24h`

    );

}





/*
================================
GLOBAL MARKET OVERVIEW
================================
*/

export async function fetchMarketOverview(){

    const data = await request(

        `${API}/global`

    );


    return data.data;

}





/*
================================
TOP GAINERS
================================
*/

export async function fetchTopGainers(
    limit=5
){

    const coins = await fetchMarket();


    return coins

        .filter(
            coin =>
            coin.price_change_percentage_24h !== null
        )

        .sort(

            (a,b)=>

            b.price_change_percentage_24h -
            a.price_change_percentage_24h

        )

        .slice(0,limit);

}





/*
================================
TOP LOSERS
================================
*/

export async function fetchTopLosers(
    limit=5
){

    const coins = await fetchMarket();


    return coins

        .filter(
            coin =>
            coin.price_change_percentage_24h !== null
        )

        .sort(

            (a,b)=>

            a.price_change_percentage_24h -
            b.price_change_percentage_24h

        )

        .slice(0,limit);

}





/*
================================
TRENDING COINS
================================
*/

export async function fetchTrendingCoins(){

    const data = await request(

        `${API}/search/trending`

    );


    return data.coins.map(

        item =>
        item.item

    );

}





/*
================================
SIMPLE PRICE
================================
*/

export async function fetchSimplePrice(
    id
){

    return request(

        `${API}/simple/price?`+
        `ids=${id}&`+
        `vs_currencies=usd,inr`

    );

}





/*
================================
USD TO INR
================================
*/

export async function fetchUSDtoINR(){

    try{

        const response = await fetch(

            "https://open.er-api.com/v6/latest/USD"

        );


        if(!response.ok){

            throw new Error(
                "Currency API Failed"
            );

        }


        const data =
        await response.json();


        return data.rates.INR;


    }
    catch(error){

        console.error(error);


        // fallback

        return 83;

    }

}





/*
================================
EXCHANGE RATES
================================
*/

export async function fetchExchangeRates(){

    const data = await request(

        `${API}/exchange_rates`

    );


    return data.rates;

}





/*
================================
CHART DATA
================================
*/

export async function fetchChart(
    id,
    days=7
){

    return request(

        `${API}/coins/${id}/market_chart?`+
        `vs_currency=usd&days=${days}`

    );

}





/*
================================
API HEALTH CHECK
================================
*/

export async function checkAPI(){

    try{

        await fetchMarket();

        return true;

    }
    catch(error){

        return false;

    }

}
/* ==========================
   USD RATE COMPATIBILITY
========================== */

export async function fetchUsdRate(){

    return await fetchUSDtoINR();

}