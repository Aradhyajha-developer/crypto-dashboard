import {
  fetchMarketOverview,
  fetchTopGainers,
  fetchTopLosers
} from "./api.js";

import {
  formatCurrency,
  formatNumber,
  formatPercent,
  showError
} from "./utils.js";

/* ---------------- Helpers ---------------- */

function setText(id, value) {
  const el = document.getElementById(id);

  if (el) {
    el.textContent = value;
  }
}

/* ---------------- Market Overview ---------------- */

export async function loadMarketOverview() {

  try {

    const market = await fetchMarketOverview();

    setText(
      "marketCap",
      formatCurrency(market.total_market_cap.usd)
    );

    setText(
      "marketVolume",
      formatCurrency(market.total_volume.usd)
    );

    setText(
      "btcDom",
      formatPercent(market.market_cap_percentage.btc)
    );

    setText(
      "ethDom",
      formatPercent(market.market_cap_percentage.eth)
    );

  } catch (error) {

    console.error(error);

    setText("marketCap", "--");
    setText("marketVolume", "--");
    setText("btcDom", "--");
    setText("ethDom", "--");

  }

}

/* ---------------- Render Coin List ---------------- */

function renderCoins(elementId, coins) {

  const list = document.getElementById(elementId);

  if (!list) return;

  list.innerHTML = "";

  coins.forEach((coin) => {

    const li = document.createElement("li");

    const change =
      Number(coin.price_change_percentage_24h || 0);

    li.innerHTML = `
      <div class="coin-row">

        <div class="coin-info">

          <img
            src="${coin.image}"
            alt="${coin.name}"
            width="28"
            height="28"
          >

          <span>${coin.name}</span>

        </div>

        <div class="coin-price">

          <strong>
            ${formatCurrency(coin.current_price)}
          </strong>

          <small
            style="
              color:${change >= 0 ? "#16a34a" : "#dc2626"};
              display:block;
            "
          >
            ${change >= 0 ? "+" : ""}
            ${change.toFixed(2)}%
          </small>

        </div>

      </div>
    `;

    list.appendChild(li);

  });

}

/* ---------------- Top Gainers ---------------- */

export async function loadTopGainers() {

  try {

    const coins = await fetchTopGainers();

    renderCoins("gainers", coins);

  } catch (error) {

    console.error(error);

    showError(
      document.getElementById("gainers"),
      "Unable to load gainers."
    );

  }

}

/* ---------------- Top Losers ---------------- */

export async function loadTopLosers() {

  try {

    const coins = await fetchTopLosers();

    renderCoins("losers", coins);

  } catch (error) {

    console.error(error);

    showError(
      document.getElementById("losers"),
      "Unable to load losers."
    );

  }

}

/* ---------------- Initialize Widgets ---------------- */

export async function loadMarketWidgets() {

  await Promise.all([

    loadMarketOverview(),

    loadTopGainers(),

    loadTopLosers()

  ]);

}