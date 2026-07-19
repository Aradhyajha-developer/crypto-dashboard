export function Home() {
  return `
    <section class="dashboard container">

      <div class="hero">

        <h1>CryptoDash</h1>

        <p>
          Track real-time cryptocurrency prices, charts and market trends.
        </p>

        <div class="search-box">

          <input
            type="text"
            id="search"
            placeholder="Search Bitcoin, Ethereum..."
          >

          <button id="searchBtn">
            Search
          </button>

        </div>

      </div>

      <section class="dashboard-grid">

        <div class="card">

          <h3>Coin Details</h3>

          <!-- Loading Spinner -->
          <div id="spinner"></div>

          <div id="coinData">
            Search a coin to view details
          </div>

        </div>

        <div class="card">

          <h3>Price Chart</h3>

          <canvas id="priceChart"></canvas>

        </div>

        <div class="card">

          <h3>Top Gainers</h3>

          <div id="gainers"></div>

        </div>

        <div class="card">

          <h3>Top Losers</h3>

          <div id="losers"></div>

        </div>

        <div class="card">

          <h3>Favorites</h3>

          <ul id="favorites"></ul>

        </div>

        <div class="card">

          <h3>USD → INR</h3>

          <input type="number" id="usd" placeholder="USD">

          <button id="convertBtn">
            Convert
          </button>

          <h2 id="inrResult">
            ₹0
          </h2>

        </div>

      </section>

    </section>
  `;
}