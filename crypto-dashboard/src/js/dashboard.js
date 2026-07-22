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

// NEW: prevent repeated API spam
let activeSearchController = null;
let activeSearchToken = 0;
const searchCache = new Map();

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
   SEARCH HANDLERS
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
    }, 500)
  );

  searchBtn?.addEventListener("click", async () => {
    const value = searchInput.value.trim();

    if (!value) {
      showError(results, "Please enter a coin name");
      return;
    }

    await runSearch(value);
  });

  searchInput.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const value = searchInput.value.trim();

    if (!value) {
      showError(results, "Please enter a coin name");
      return;
    }

    await runSearch(value);
  });

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".search-box") &&
      !e.target.closest(".suggestions")
    ) {
      suggestions.innerHTML = "";
    }
  });
}

async function runSearch(value) {
  try {
    showLoader();

    const searchResults = await searchCoin(value);

    if (!searchResults?.coins?.length) {
      showError(results, "Coin not found. Try Bitcoin or Ethereum.");
      return;
    }

    const coinId = searchResults.coins[0].id;
    await loadCoin(coinId);

    suggestions.innerHTML = "";
    searchInput.value = "";
  } catch (error) {
    console.error("Search error:", error);
    showError(results, "Search failed. Please try again.");
  } finally {
    hideLoader();
  }
}

/* ==========================================
   SEARCH SUGGESTIONS
========================================== */

async function showSuggestions(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery.length < 2) {
    suggestions.innerHTML = "";
    return;
  }

  if (searchCache.has(normalizedQuery)) {
    const cached = searchCache.get(normalizedQuery);

    suggestions.innerHTML = "";
    renderSuggestionList(cached);
    return;
  }

  activeSearchToken += 1;
  const token = activeSearchToken;

  activeSearchController?.abort();

  const controller = new AbortController();
  activeSearchController = controller;

  try {
    const data = await searchCoin(normalizedQuery, { signal: controller.signal });

    if (token !== activeSearchToken) return;

    searchCache.set(normalizedQuery, data.coins || []);
    suggestions.innerHTML = "";

    renderSuggestionList(data.coins || []);
  } catch (error) {
    if (error.name === "AbortError") return;

    console.error("Suggestions error:", error);
    suggestions.innerHTML = `
      <div class="suggestion-item no-results">
        Search error
      </div>
    `;
  }
}

function renderSuggestionList(coins) {
  if (!coins.length) {
    suggestions.innerHTML = `
      <div class="suggestion-item no-results">
        No results found
      </div>
    `;
    return;
  }

  coins.slice(0, 5).forEach((coin) => {
    const item = document.createElement("div");
    item.className = "suggestion-item";

    const imageUrl =
      coin.thumb || coin.large || "https://via.placeholder.com/32";

    item.innerHTML = `
      <img
        src="${imageUrl}"
        alt="${coin.name}"
        width="24"
        height="24"
        loading="lazy"
        onerror="this.src='https://via.placeholder.com/24'"
      />
      <span>${coin.name} (${coin.symbol.toUpperCase()})</span>
    `;

    item.style.cssText = `
      display:flex;
      align-items:center;
      gap:10px;
      padding:10px 12px;
      cursor:pointer;
      border-bottom:1px solid #e5e7eb;
    `;

    item.addEventListener("mouseover", () => {
      item.style.backgroundColor = "#f5f5f5";
    });

    item.addEventListener("mouseout", () => {
      item.style.backgroundColor = "transparent";
    });

    item.addEventListener("click", async () => {
      searchInput.value = coin.name;
      suggestions.innerHTML = "";

      try {
        showLoader();
        await loadCoin(coin.id);
      } catch (error) {
        console.error("Suggestion click error:", error);
        showError(results, "Unable to load coin data.");
      } finally {
        hideLoader();
      }
    });

    suggestions.appendChild(item);
  });
}

/* ==========================================
   LOAD COIN
========================================== */

async function loadCoin(id) {
  try {
    showLoader();

    if (!id || typeof id !== "string") {
      throw new Error("Invalid coin id");
    }

    const coin = await fetchCoin(id.toLowerCase().trim());

    if (!coin) {
      throw new Error("Coin data not found");
    }

    currentCoin = coin;
    localStorage.setItem("lastCoin", coin.id);

    renderCoin(coin);
    await loadChart(coin.id);
  } catch (error) {
    console.error("Coin load error:", error);
    showError(results, "Unable to load coin data. Please try again.");
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

  const coinImage = coin.image?.large || "https://via.placeholder.com/80";
  const priceChange = market?.price_change_percentage_24h ?? 0;
  const priceChangeClass = priceChange >= 0 ? "positive" : "negative";
  const priceChangeIcon = priceChange >= 0 ? "📈" : "📉";

  results.innerHTML = `
    <div class="coin-card">
      <div class="coin-header">
        <img
          src="${coinImage}"
          alt="${coin.name}"
          width="80"
          height="80"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/80'"
        />
        <div>
          <h2>${coin.name} (${coin.symbol.toUpperCase()})</h2>
          <p>Rank #${coin.market_cap_rank ?? "--"}</p>
        </div>
      </div>

      <div class="coin-price">
        <h1>${formatCurrency(market?.current_price?.usd || 0)}</h1>
        <p class="${priceChangeClass}">
          ${priceChangeIcon} ${formatPercent(priceChange)} (24h)
        </p>
      </div>

      <button id="favoriteBtn">
        ${isFav ? "⭐ Remove Favorite" : "☆ Add Favorite"}
      </button>
    </div>
  `;

  const favoriteBtn = document.getElementById("favoriteBtn");

  if (favoriteBtn) {
    favoriteBtn.addEventListener("click", () => {
      if (isFavorite(coin.id)) {
        removeFavorite(coin.id);
      } else {
        saveFavorite(coin.id);
      }

      renderCoin(coin);
      renderFavorites();
    });
  }
}

/* ==========================================
   LOAD CHART
========================================== */

async function loadChart(id) {
  try {
    destroyChart();

    const history = await fetchHistory(id);

    if (!history?.prices?.length) {
      throw new Error("No chart data available");
    }

    createChart("priceChart", history);
  } catch (error) {
    console.error("Chart error:", error);
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

  if (!favorites.length) {
    favList.innerHTML = `<li>No favorite coins yet</li>`;
    return;
  }

  try {
    const coins = await Promise.all(
      favorites.map((id) => fetchCoin(id).catch(() => null))
    );

    coins.filter(Boolean).forEach((coin) => {
      const li = document.createElement("li");
      li.className = "favorite-item";

      li.innerHTML = `
        <div class="favorite-row">
          <span>${coin.name}</span>
          <button class="remove-fav" data-id="${coin.id}">❌</button>
        </div>
      `;

      favList.appendChild(li);
    });
  } catch (error) {
    console.error("Favorites render error:", error);
    favList.innerHTML = `<li>Unable to load favorites</li>`;
  }
}

/* ==========================================
   FAVORITE EVENTS
========================================== */

favList?.addEventListener("click", async (event) => {
  const button = event.target.closest(".remove-fav");

  if (!button) return;

  const coinId = button.dataset.id;

  removeFavorite(coinId);
  await renderFavorites();

  if (currentCoin && currentCoin.id === coinId) {
    renderCoin(currentCoin);
  }
});

/* ==========================================
   RESTORE LAST COIN
========================================== */

async function restoreLastCoin() {
  const lastCoin = localStorage.getItem("lastCoin");

  try {
    if (lastCoin?.trim()) {
      await loadCoin(lastCoin.trim());
    } else {
      await loadCoin("bitcoin");
    }
  } catch (error) {
    console.error("Restore coin error:", error);

    try {
      await loadCoin("bitcoin");
    } catch (fallbackError) {
      console.error("Fallback failed:", fallbackError);
      showError(results, "Unable to load dashboard. Please refresh.");
    }
  }
}

/* ==========================================
   EXPORT CURRENT COIN
========================================== */

export function getCurrentCoin() {
  return currentCoin;
}