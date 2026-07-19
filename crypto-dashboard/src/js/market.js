import { fetchMarket } from "./api.js";

const gainers = document.getElementById("gainers");
const losers = document.getElementById("losers");

export async function loadMarket() {

  if (!gainers || !losers) return;

  gainers.innerHTML = "Loading...";
  losers.innerHTML = "Loading...";

  try {

    const coins = await fetchMarket();

    const sorted = [...coins].sort(
      (a, b) =>
        b.price_change_percentage_24h -
        a.price_change_percentage_24h
    );

    const topGainers = sorted.slice(0, 5);

    const topLosers = [...sorted]
      .reverse()
      .slice(0, 5);

    gainers.innerHTML = topGainers.map(coin => `

      <div class="market-item">

        <span>${coin.name}</span>

        <strong style="color:green">
          +${coin.price_change_percentage_24h.toFixed(2)}%
        </strong>

      </div>

    `).join("");

    losers.innerHTML = topLosers.map(coin => `

      <div class="market-item">

        <span>${coin.name}</span>

        <strong style="color:red">
          ${coin.price_change_percentage_24h.toFixed(2)}%
        </strong>

      </div>

    `).join("");

  } catch (err) {

    gainers.innerHTML = "<p>Unable to load market.</p>";
    losers.innerHTML = "<p>Unable to load market.</p>";

    console.error(err);

  }

}

loadMarket();