const API = "https://api.coingecko.com/api/v3";

async function request(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API Error (${response.status})`);
  }

  return response.json();
}

/* ==========================
   Search Coins
========================== */

export async function searchCoin(query) {
  if (!query || !query.trim()) {
    return { coins: [] };
  }

  return request(
    `${API}/search?query=${encodeURIComponent(query.trim())}`
  );
}

/* ==========================
   Fetch Single Coin
========================== */

export async function fetchCoin(id = "bitcoin") {
  return request(
    `${API}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  );
}

/* ==========================
   Fetch 7 Days History
========================== */

export async function fetchHistory(id = "bitcoin") {
  return request(
    `${API}/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`
  );
}

/* ==========================
   Top Market Coins
========================== */

export async function fetchMarket() {
  return request(
    `${API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
  );
}

/* ==========================
   Top Gainers
========================== */

export async function fetchTopGainers(limit = 5) {
  const coins = await fetchMarket();

  return [...coins]
    .sort(
      (a, b) =>
        (b.price_change_percentage_24h || 0) -
        (a.price_change_percentage_24h || 0)
    )
    .slice(0, limit);
}

/* ==========================
   Top Losers
========================== */

export async function fetchTopLosers(limit = 5) {
  const coins = await fetchMarket();

  return [...coins]
    .sort(
      (a, b) =>
        (a.price_change_percentage_24h || 0) -
        (b.price_change_percentage_24h || 0)
    )
    .slice(0, limit);
}

/* ==========================
   Global Market Overview
========================== */

export async function fetchGlobalMarket() {
  const data = await request(`${API}/global`);

  return data.data;
}

/* ==========================
   Trending Coins
========================== */

export async function fetchTrendingCoins() {
  const data = await request(`${API}/search/trending`);

  return data.coins.map(item => item.item);
}

/* ==========================
   Exchange Rates
========================== */

export async function fetchExchangeRates() {
  const data = await request(`${API}/exchange_rates`);

  return data.rates;
}

/* ==========================
   USD → INR
========================== */

export async function fetchUSDtoINR() {
  try {
    const res = await fetch(
      "https://open.er-api.com/v6/latest/USD"
    );

    if (!res.ok) {
      throw new Error("Exchange API Error");
    }

    const data = await res.json();

    return data.rates.INR;
  } catch (err) {
    console.error(err);

    // fallback value
    return 83;
  }
}

/* ==========================
   Simple Price
========================== */

export async function fetchSimplePrice(id) {
  return request(
    `${API}/simple/price?ids=${id}&vs_currencies=usd,inr`
  );
}

/* ==========================
   Coin Market Chart
========================== */

export async function fetchChart(id, days = 7) {
  return request(
    `${API}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  );
}

/* ==========================
   Health Check
========================== */

export async function checkAPI() {
  try {
    await fetchMarket();
    return true;
  } catch {
    return false;
  }
}