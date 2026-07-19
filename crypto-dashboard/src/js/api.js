const API = "https://api.coingecko.com/api/v3";

export async function fetchCoin(id = "bitcoin") {
  const res = await fetch(`${API}/coins/${id}`);

  if (!res.ok) {
    throw new Error("Coin not found");
  }

  return await res.json();
}

export async function fetchHistory(id = "bitcoin") {
  const res = await fetch(
    `${API}/coins/${id}/market_chart?vs_currency=usd&days=7`
  );

  if (!res.ok) {
    throw new Error("History not found");
  }

  return await res.json();
}