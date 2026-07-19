const API = "https://api.coingecko.com/api/v3";

export async function fetchMarket() {
  const res = await fetch(
    `${API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch market data");
  }

  return await res.json();
}