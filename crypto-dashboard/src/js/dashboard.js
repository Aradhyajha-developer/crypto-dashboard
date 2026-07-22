import {
  searchCoin,
  fetchCoin,
  fetchHistory
} from "./api.js";

import {
  saveFavorite,
  removeFavorite,
  getFavorites,
  isFavorite
} from "./storage.js";

import {
  createChart,
  destroyChart
} from "./chart.js";

import {
  loadMarketWidgets
} from "./market.js";

import {
  initializeConverter
} from "./converter.js";

import {
  showLoader,
  hideLoader
} from "./loader.js";

import {
  formatCurrency,
  formatPercent,
  debounce,
  showError
} from "./utils.js";

let searchInput;
let searchBtn;
let suggestions;
let results;
let favList;

let currentCoin = null;
let initialized = false;

/* ==========================================
   INIT
========================================== */

export async function initDashboard() {

  if (initialized) return;

  initialized = true;

  searchInput = document.getElementById("search");
  searchBtn = document.getElementById("searchBtn");
  suggestions = document.getElementById("suggestions");
  results = document.getElementById("results");
  favList = document.getElementById("favList");

  await loadMarketWidgets();

  await initializeConverter();

  setupSearch();

  await renderFavorites();

  await restoreLastCoin();
}

/* ==========================================
   SEARCH
========================================== */

function setupSearch() {

  if (!searchInput) return;

  searchInput.addEventListener(
    "input",
    debounce(async (e) => {

      const value = e.target.value.trim();

      if (!value) {

        suggestions.innerHTML = "";

        return;
      }

      await showSuggestions(value);

    }, 300)
  );

  searchBtn?.addEventListener("click", () => {

    const value = searchInput.value.trim();

    if (!value) return;

    loadCoin(value.toLowerCase());

    suggestions.innerHTML = "";

  });

  searchInput.addEventListener("keydown", (e) => {

    if (e.key !== "Enter") return;

    const value = searchInput.value.trim();

    if (!value) return;

    loadCoin(value.toLowerCase());

    suggestions.innerHTML = "";

  });

}

/* ==========================================
   SEARCH SUGGESTIONS
========================================== */

async function showSuggestions(query) {

  try {

    const data = await searchCoin(query);

    suggestions.innerHTML = "";

    if (!data?.coins?.length) {

      suggestions.innerHTML = `
        <div class="suggestion-item">
          No results found
        </div>
      `;

      return;
    }

    data.coins
      .slice(0, 5)
      .forEach((coin) => {

        const item = document.createElement("div");

        item.className = "suggestion-item";

        item.innerHTML = `
          <img
            src="${coin.thumb}"
            alt="${coin.name}"
            width="24"
            height="24"
            loading="lazy"
          />

          <div>

            <strong>${coin.name}</strong>

            <small>
              ${coin.symbol.toUpperCase()}
            </small>

          </div>
        `;

        item.addEventListener("click", () => {

          searchInput.value = coin.name;

          suggestions.innerHTML = "";

          loadCoin(coin.id);

        });

        suggestions.appendChild(item);

      });

  }

  catch (error) {

    console.error(error);

    suggestions.innerHTML = "";

  }

}
/* ==========================================
   LOAD COIN
========================================== */

async function loadCoin(id) {

  try {

    showLoader();

    if (suggestions) {
      suggestions.innerHTML = "";
    }

    const coin = await fetchCoin(id);

    if (!coin) {
      throw new Error("Coin not found");
    }

    currentCoin = coin;

    localStorage.setItem("lastCoin", coin.id);

    renderCoin(coin);

    await loadChart(coin.id);

  } catch (error) {

    console.error("Coin Load Error:", error);

    showError(
      results,
      "Unable to load coin data."
    );

    destroyChart();

  } finally {

    hideLoader();

  }

}

/* ==========================================
   RENDER COIN
========================================== */

function renderCoin(coin) {

  if (!coin || !results) return;

  const market = coin.market_data;

  const isFav = isFavorite(coin.id);

  results.innerHTML = `

<div class="coin-card">

  <div class="coin-header">

    <img
      src="${coin.image.large}"
      alt="${coin.name}"
      width="80"
      height="80"
      loading="lazy"
    />

    <div>

      <h2>
        ${coin.name}
        (${coin.symbol.toUpperCase()})
      </h2>

      <p>
        Rank #${coin.market_cap_rank ?? "--"}
      </p>

    </div>

  </div>

  <div class="coin-price">

    <h1>
      ${formatCurrency(
        market.current_price.usd
      )}
    </h1>

    <p class="${
      market.price_change_percentage_24h >= 0
        ? "positive"
        : "negative"
    }">

      ${
        formatPercent(
          market.price_change_percentage_24h
        )
      }

    </p>

  </div>

  <div class="coin-stats">

    <div class="stat">

      <span>Market Cap</span>

      <strong>

        ${formatCurrency(
          market.market_cap.usd
        )}

      </strong>

    </div>

    <div class="stat">

      <span>24h Volume</span>

      <strong>

        ${formatCurrency(
          market.total_volume.usd
        )}

      </strong>

    </div>

    <div class="stat">

      <span>24h High</span>

      <strong>

        ${formatCurrency(
          market.high_24h.usd
        )}

      </strong>

    </div>

    <div class="stat">

      <span>24h Low</span>

      <strong>

        ${formatCurrency(
          market.low_24h.usd
        )}

      </strong>

    </div>

  </div>

  <button
    id="favoriteBtn"
    class="favorite-btn"
  >

    ${
      isFav
        ? "⭐ Remove Favorite"
        : "☆ Add Favorite"
    }

  </button>

</div>

`;

  const favoriteBtn =
    document.getElementById("favoriteBtn");

  if (favoriteBtn) {

    favoriteBtn.addEventListener(
      "click",
      () => {

        if (isFavorite(coin.id)) {

          removeFavorite(coin.id);

        } else {

          saveFavorite(coin.id);

        }

        renderCoin(coin);

        renderFavorites();

      }
    );

  }

}

/* ==========================================
   LOAD CHART
========================================== */

async function loadChart(id) {

  try {

    destroyChart();

    const history =
      await fetchHistory(id);

    if (
      !history ||
      !history.prices ||
      history.prices.length === 0
    ) {

      throw new Error(
        "No chart history found"
      );

    }

    createChart(
      "priceChart",
      history
    );

  } catch (error) {

    console.error(
      "Chart Error:",
      error
    );

    destroyChart();

  }

}
/* ==========================================
   FAVORITES
========================================== */

async function renderFavorites() {

  if (!favList) return;

  const favorites = getFavorites();

  favList.innerHTML = "";

  if (favorites.length === 0) {

    favList.innerHTML = `
      <li class="empty-favorites">
        ⭐ No favorite coins yet
      </li>
    `;

    return;
  }

  try {

    const coins = await Promise.all(
      favorites.map(id => fetchCoin(id))
    );

    coins.forEach((coin) => {

      const li = document.createElement("li");

      li.className = "favorite-item";

      li.innerHTML = `

<div class="favorite-row">

<div class="favorite-info">

<img
src="${coin.image.small}"
alt="${coin.name}"
width="28"
height="28"
loading="lazy"
/>

<span>

${coin.name}

</span>

</div>

<div class="favorite-price">

${formatCurrency(
coin.market_data.current_price.usd
)}

</div>

<button
class="remove-fav"
data-id="${coin.id}"
title="Remove Favorite"
>

❌

</button>

</div>

`;

      favList.appendChild(li);

    });

  }

  catch (error) {

    console.error(error);

    showError(
      favList,
      "Unable to load favorites."
    );

  }

}

/* ==========================================
   FAVORITE EVENTS
========================================== */

favList?.addEventListener("click", (event) => {

  const button = event.target.closest(".remove-fav");

  if (!button) return;

  removeFavorite(button.dataset.id);

  renderFavorites();

  if (
    currentCoin &&
    currentCoin.id === button.dataset.id
  ) {

    renderCoin(currentCoin);

  }

});

/* ==========================================
   RESTORE LAST COIN
========================================== */

async function restoreLastCoin() {

  const lastCoin =
    localStorage.getItem("lastCoin");

  try {

    if (lastCoin) {

      await loadCoin(lastCoin);

    } else {

      await loadCoin("bitcoin");

    }

  }

  catch (error) {

    console.error(error);

    await loadCoin("bitcoin");

  }

}

/* ==========================================
   EXPORT CURRENT COIN
========================================== */

export function getCurrentCoin() {

  return currentCoin;

}