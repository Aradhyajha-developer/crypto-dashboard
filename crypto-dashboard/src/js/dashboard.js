import { fetchCoin } from "./api.js";
import { renderChart } from "./chart.js";

window.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("search");
  const searchBtn = document.getElementById("searchBtn");
  const coinData = document.getElementById("coinData");
  const spinner = document.getElementById("spinner");

  searchBtn.addEventListener("click", loadCoin);
  searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    loadCoin();
  }
});

  async function loadCoin() {

    const coin = searchInput.value.trim().toLowerCase();
    spinner.innerHTML = `
  <div class="spinner" style="display:block;">
    <div class="loader"></div>
    <p>Loading...</p>
  </div>
`;

coinData.innerHTML = "";

    if (!coin) return;
    if (!coin) {
  coinData.innerHTML = `
    <p style="color:red;">Please enter a coin name.</p>
  `;
  return;
}

    try {

      const data = await fetchCoin(coin);
      const history = await fetchHistory(coin);

renderChart(history, data.name);
      spinner.innerHTML = "";

      coinData.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${data.image.small}" alt="${data.name}">
        <p><strong>Price:</strong> $${data.market_data.current_price.usd}</p>
        <p><strong>24h Change:</strong> ${data.market_data.price_change_percentage_24h.toFixed(2)}%</p>
        <p><strong>Market Cap:</strong> $${data.market_data.market_cap.usd.toLocaleString()}</p>
      `;

    } catch (err) {

    coinData.innerHTML = `
  <div class="error-card">
    <h3>❌ Coin Not Found</h3>
    <p>Please enter a valid cryptocurrency name.</p>
  </div>
`;
spinner.innerHTML = "";

    }

  }

});