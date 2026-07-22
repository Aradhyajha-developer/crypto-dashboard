export default function Home() {
  return `

<section class="dashboard">

<div class="search-section">

<input
id="search"
type="text"
placeholder="Search Cryptocurrency..."
autocomplete="off"
/>

<button id="searchBtn">

Search

</button>

<div id="suggestions"></div>

</div>

<div id="results"></div>

<section class="market-overview">

<h2>

Market Overview

</h2>

<div id="marketOverview"></div>

</section>

<section class="gainers-losers">

<div>

<h2>

Top Gainers

</h2>

<div id="topGainers"></div>

</div>

<div>

<h2>

Top Losers

</h2>

<div id="topLosers"></div>

</div>

</section>

<section class="chart-section">

<h2>

7 Day Price Chart

</h2>

<canvas id="priceChart"></canvas>

</section>

<section class="converter">

<h2>

USD → INR Converter

</h2>

<div id="converter"></div>

</section>

<section>

<h2>

Favorites

</h2>

<div id="favList"></div>

</section>

</section>

`;
}