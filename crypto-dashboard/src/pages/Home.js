export default function Home() {
  return `
    <main class="dashboard">

      <!-- Hero -->
      <section class="hero">
        <div class="hero-content">
          <h1>🚀 CryptoDash</h1>
          <p>
            Track live cryptocurrency prices, market trends,
            gainers, losers and your favorite coins in one place.
          </p>

          <div class="search-box">
            <input
              id="search"
              type="text"
              placeholder="Search Bitcoin, Ethereum, Solana..."
              autocomplete="off"
            />

            <button id="searchBtn">
              Search
            </button>
          </div>

          <div id="suggestions" class="suggestions"></div>
        </div>
      </section>

      <!-- Market Overview -->
      <section id="market" class="overview">

        <h2>📊 Market Overview</h2>

        <div class="overview-grid">

          <div class="overview-card">
            <h3>Total Market Cap</h3>
            <p id="marketCap">Loading...</p>
          </div>

          <div class="overview-card">
            <h3>24H Volume</h3>
            <p id="marketVolume">Loading...</p>
          </div>

          <div class="overview-card">
            <h3>BTC Dominance</h3>
            <p id="btcDom">Loading...</p>
          </div>

          <div class="overview-card">
            <h3>ETH Dominance</h3>
            <p id="ethDom">Loading...</p>
          </div>

        </div>

      </section>

      <!-- Coin Details -->
      <section class="coin-section">

        <div id="results">

          <div class="placeholder-card">

            <h2>Search Any Coin</h2>

            <p>
              Search Bitcoin, Ethereum, Solana and
              more to view live data.
            </p>

          </div>

        </div>

      </section>

      <!-- Chart -->
      <section class="chart-section">

        <h2>📈 7 Day Price Chart</h2>

        <div class="chart-card">

          <canvas id="priceChart"></canvas>

        </div>

      </section>

      <!-- Widgets -->
      <section class="widgets">

        <div class="widget">

          <h2>🔥 Top Gainers</h2>

          <ul id="gainers">

            <li>Loading...</li>

          </ul>

        </div>

        <div class="widget">

          <h2>📉 Top Losers</h2>

          <ul id="losers">

            <li>Loading...</li>

          </ul>

        </div>

      </section>

      <!-- Converter -->
      <section class="converter">

        <h2>💱 USD → INR Converter</h2>

        <div class="converter-box">

          <input
            type="number"
            id="usd"
            placeholder="Enter USD"
          >

          <button id="convertBtn">
            Convert
          </button>

          <h3 id="inrResult">
            ₹0
          </h3>

        </div>

      </section>

      <!-- Favorites -->
      <section
        id="favorites"
        class="favorites"
      >

        <h2>⭐ My Favorites</h2>

        <ul id="favList">

          <li>No favorites yet.</li>

        </ul>

      </section>

      <!-- Loader -->
      <div
        id="loader"
        class="loader hidden"
      >

        <div class="spinner"></div>

      </div>

    </main>
  `;
}