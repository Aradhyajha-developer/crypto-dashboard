const API = "https://api.coingecko.com/api/v3";


// Fetch coin details

export async function fetchCoin(id = "bitcoin") {


  const res = await fetch(
    `${API}/coins/${id}`
  );


  if (!res.ok) {

    throw new Error("Coin not found");

  }


  return await res.json();

}





// Fetch 7 days price history

export async function fetchHistory(id = "bitcoin") {


  const res = await fetch(

    `${API}/coins/${id}/market_chart?vs_currency=usd&days=7`

  );


  if (!res.ok) {

    throw new Error("History not found");

  }


  return await res.json();

}





// Search coin suggestions

export async function searchCoins(query) {


  const res = await fetch(

    `${API}/search?query=${query}`

  );



  if (!res.ok) {

    throw new Error("Search failed");

  }



  return await res.json();


}