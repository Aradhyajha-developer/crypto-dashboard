import { fetchCoin } from "./api.js";
import { renderChart } from "./chart.js";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorite
} from "./storage.js";
import { fetchMarket } from "./market.js";

window.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("search");
  const searchBtn = document.getElementById("searchBtn");
  const coinData = document.getElementById("coinData");
  const spinner = document.getElementById("spinner");
  renderFavorites();
  loadMarket();

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
      const favoriteBtn = document.getElementById("favoriteBtn");

favoriteBtn.addEventListener("click", () => {

  addFavorite(data.id);

  renderFavorites();

  favoriteBtn.textContent = "❤️ Saved";

});
        <h2>${data.name}</h2>
        <img src="${data.image.small}" alt="${data.name}">
        <p><strong>Price:</strong> $${data.market_data.current_price.usd}</p>
        <p><strong>24h Change:</strong> ${data.market_data.price_change_percentage_24h.toFixed(2)}%</p>
        <p><strong>Market Cap:</strong> $${data.market_data.market_cap.usd.toLocaleString()}</p>
        <button id="favoriteBtn">
  ${isFavorite(data.id) ? "❤️ Saved" : "🤍 Add to Favorites"}
</button>
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
function renderFavorites() {

  const list = document.getElementById("favorites");

  const favorites = getFavorites();

  if (!favorites.length) {

    list.innerHTML = "<li>No favorites yet.</li>";

    return;

  }

  list.innerHTML = favorites.map(coin => `
    <li class="favorite-item">
      <span>${coin}</span>
      <button class="removeBtn" data-id="${coin}">
        ❌
      </button>
    </li>
  `).join("");

  document.querySelectorAll(".removeBtn").forEach(btn => {

    btn.addEventListener("click", () => {

      removeFavorite(btn.dataset.id);

      renderFavorites();

    });

  });

}
async function loadMarket() {

  try {

    const data = await fetchMarket();

    const gainers = [...data]
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 5);

    const losers = [...data]
      .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
      .slice(0, 5);

    document.getElementById("gainers").innerHTML = gainers
      .map(
        coin => `
          <p>🟢 ${coin.name} (${coin.price_change_percentage_24h.toFixed(2)}%)</p>
        `
      )
      .join("");

    document.getElementById("losers").innerHTML = losers
      .map(
        coin => `
          <p>🔴 ${coin.name} (${coin.price_change_percentage_24h.toFixed(2)}%)</p>
        `
      )
      .join("");

  } catch (err) {

    document.getElementById("gainers").innerHTML = "Unable to load";
    document.getElementById("losers").innerHTML = "Unable to load";

  }

}