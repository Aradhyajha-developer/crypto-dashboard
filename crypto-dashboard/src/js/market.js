import {
  fetchMarketOverview,
  fetchTopGainers,
  fetchTopLosers
} from "./api.js";

import {
  formatCurrency,
  formatPercent,
  showError
} from "./utils.js";

/* ==========================================
   HELPERS
========================================== */

function getElement(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const element = getElement(id);

  if (element) {
    element.textContent = value;
  }
}

function setLoading(id) {
  const element = getElement(id);

  if (element) {
    element.innerHTML = "<p>Loading...</p>";
  }
}

function clearLoading(id) {
  const element = getElement(id);

  if (element) {
    element.innerHTML = "";
  }
}

/* ==========================================
   MARKET OVERVIEW
========================================== */

export async function loadMarketOverview() {
  try {
    const market = await fetchMarketOverview();

    setText(
      "marketCap",
      formatCurrency(
        market?.total_market_cap?.usd || 0
      )
    );

    setText(
      "marketVolume",
      formatCurrency(
        market?.total_volume?.usd || 0
      )
    );

    setText(
      "btcDom",
      formatPercent(
        market?.market_cap_percentage?.btc || 0
      )
    );

    setText(
      "ethDom",
      formatPercent(
        market?.market_cap_percentage?.eth || 0
      )
    );

  } catch (error) {

    console.error("Market Overview Error:", error);

    setText("marketCap", "--");
    setText("marketVolume", "--");
    setText("btcDom", "--");
    setText("ethDom", "--");
  }
}

/* ==========================================
   RENDER COINS
========================================== */

function renderCoins(elementId, coins) {

  const list = getElement(elementId);

  if (!list) return;

  clearLoading(elementId);

  if (!coins?.length) {

    list.innerHTML =
      "<p>No market data available.</p>";

    return;
  }

  const fragment =
    document.createDocumentFragment();

  coins.forEach((coin) => {

    const li =
      document.createElement("li");

    const change =
      Number(
        coin.price_change_percentage_24h || 0
      );

    li.innerHTML = `
      <div class="coin-row">

        <div class="coin-info">

          <img
            src="${coin.image}"
            alt="${coin.name}"
            width="30"
            height="30"
            loading="lazy"
          />

          <span>${coin.name}</span>

        </div>

        <div class="coin-price">

          <strong>
            ${formatCurrency(coin.current_price)}
          </strong>

          <small class="${
            change >= 0
              ? "positive"
              : "negative"
          }">

            ${
              change >= 0
                ? "+"
                : ""
            }

            ${change.toFixed(2)}%

          </small>

        </div>

      </div>
    `;

    fragment.appendChild(li);

  });

  list.innerHTML = "";

  list.appendChild(fragment);
}

/* ==========================================
   TOP GAINERS
========================================== */

export async function loadTopGainers() {

  setLoading("gainers");

  try {

    const coins =
      await fetchTopGainers();

    renderCoins(
      "gainers",
      coins
    );

  } catch (error) {

    console.error(error);

    showError(
      getElement("gainers"),
      "Unable to load Top Gainers."
    );

  }

}

/* ==========================================
   TOP LOSERS
========================================== */

export async function loadTopLosers() {

  setLoading("losers");

  try {

    const coins =
      await fetchTopLosers();

    renderCoins(
      "losers",
      coins
    );

  } catch (error) {

    console.error(error);

    showError(
      getElement("losers"),
      "Unable to load Top Losers."
    );

  }

}

/* ==========================================
   LOAD ALL MARKET WIDGETS
========================================== */

export async function loadMarketWidgets() {

  try {

    await Promise.all([

      loadMarketOverview(),

      loadTopGainers(),

      loadTopLosers()

    ]);

  } catch (error) {

    console.error(
      "Market Widget Error:",
      error
    );

  }

}

/* ==========================================
   REFRESH MARKET
========================================== */

export async function refreshMarketWidgets() {

  return loadMarketWidgets();

}