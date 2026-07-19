const API = "https://api.coingecko.com/api/v3";

async function request(url, errorMessage) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(errorMessage);
  }

  return await res.json();
}

// Search Coin
export async function searchCoin(query) {
  return request(
    `${API}/search?query=${encodeURIComponent(query)}`,
    "Unable to search coin."
  );
}

// Coin Details
export async function fetchCoin(id) {
  return request(
    `${API}/coins/${id}`,
    "Coin not found."
  );
}

// 7 Days Chart
export async function fetchHistory(id) {
  return request(
    `${API}/coins/${id}/market_chart?vs_currency=usd&days=7`,
    "History unavailable."
  );
}

// Market Data
export async function fetchMarket() {
  return request(
    `${API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`,
    "Market data unavailable."
  );
}