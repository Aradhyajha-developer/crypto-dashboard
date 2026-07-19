import { fetchCoin } from "./api.js";

const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const coinData = document.getElementById("coinData");

searchBtn.addEventListener("click", loadCoin);

async function loadCoin() {
  const coin = searchInput.value.trim().toLowerCase();

  if (!coin) return;

  try {
    const data = await fetchCoin(coin);

    coinData.innerHTML = `
      <h2>${data.name}</h2>
      <img src="${data.image.small}" alt="${data.name}">
      <p><strong>Price:</strong> $${data.market_data.current_price.usd}</p>
      <p><strong>24h Change:</strong> ${data.market_data.price_change_percentage_24h.toFixed(2)}%</p>
      <p><strong>Market Cap:</strong> $${data.market_data.market_cap.usd.toLocaleString()}</p>
    `;
  } catch (err) {
    coinData.innerHTML = `
      <p style="color:red;">Coin not found.</p>
    `;
  }
}