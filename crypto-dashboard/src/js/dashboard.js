import {
  searchCoin,
  fetchCoin,
  fetchHistory
} from "./api.js";

import {
  saveFavorite,
  getFavorites,
  removeFavorite
} from "./storage.js";

import {
  createChart
} from "./chart.js";

const search = document.getElementById("search");
const results = document.getElementById("results");
const favList = document.getElementById("favList");

search?.addEventListener("keypress", async (e) => {

  if (e.key !== "Enter") return;

  const value = search.value.trim().toLowerCase();

  if (!value) {
    results.innerHTML = `
      <p class="error">Please enter a coin name.</p>
    `;
    return;
  }

  results.innerHTML = `<p>Loading...</p>`;

  try {

    const searchData = await searchCoin(value);

    if (!searchData.coins.length) {
      throw new Error("Coin not found");
    }

    const coin = searchData.coins[0];

    const data = await fetchCoin(coin.id);

    showCoin(data);

    const history = await fetchHistory(coin.id);

    createChart(history);

  } catch (err) {

    results.innerHTML = `
      <p class="error">
        Coin not found.
      </p>
    `;

    console.error(err);

  }

});

function showCoin(data) {

  results.innerHTML = `

    <div class="coin-card">

      <img src="${data.image.small}" alt="${data.name}">

      <h2>
        ${data.name}
        (${data.symbol.toUpperCase()})
      </h2>

      <h3>
        $${data.market_data.current_price.usd.toLocaleString()}
      </h3>

      <p>
        Market Cap:
        $${data.market_data.market_cap.usd.toLocaleString()}
      </p>

      <p>
        24h Change:
        ${data.market_data.price_change_percentage_24h.toFixed(2)}%
      </p>

      <button id="favoriteBtn">
        ⭐ Add Favorite
      </button>

    </div>

  `;

  document
    .getElementById("favoriteBtn")
    .addEventListener("click", () => {

      saveFavorite(data.id);

      renderFavorites();

    });

}

function renderFavorites() {

  const favorites = getFavorites();

  if (!favorites.length) {

    favList.innerHTML = `
      <li>No favorites added.</li>
    `;

    return;

  }

  favList.innerHTML = favorites.map((coin) => `

      <li class="favorite-item">

        <span>${coin}</span>

        <button
          class="remove-btn"
          data-id="${coin}"
        >
          ❌
        </button>

      </li>

  `).join("");

  document
    .querySelectorAll(".remove-btn")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        removeFavorite(btn.dataset.id);

        renderFavorites();

      });

    });

}

renderFavorites();