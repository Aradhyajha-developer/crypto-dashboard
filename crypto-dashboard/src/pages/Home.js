export default function Home() {

return `

<main class="dashboard">

<section class="hero">

<h1>

🚀 CryptoDash

</h1>

<p>

Track cryptocurrency prices in real time.

</p>

</section>



<section class="search-box">

<input

id="search"

placeholder="Search Bitcoin, Ethereum..."

autocomplete="off"

/>

<button>

Search

</button>

</section>



<section class="stats">

<div class="card">

<h3>Bitcoin</h3>

<p>$67,000</p>

</div>

<div class="card">

<h3>Market Cap</h3>

<p>$2.5T</p>

</div>

<div class="card">

<h3>24h Volume</h3>

<p>$90B</p>

</div>

</section>



<section class="market-layout">

<div class="card">

<h2>Search Result</h2>

<div id="results">

Search a cryptocurrency.

</div>

</div>



<div class="card">

<h2>Favorites</h2>

<ul id="favList">

</ul>

</div>

</section>



<section class="card chart">

<h2>

7 Day Price Chart

</h2>

<div class="chart-container">

<canvas id="priceChart"></canvas>

</div>

</section>



<section class="card converter">

<h2>

USD → INR Converter

</h2>

<input

type="number"

id="amount"

placeholder="Enter USD"

/>

<button id="convertBtn">

Convert

</button>

<h3 id="converted"></h3>

</section>



<section class="market-layout">

<div class="card">

<h2>

🚀 Top Gainers

</h2>

<div id="gainers">

Loading...

</div>

</div>



<div class="card">

<h2>

📉 Top Losers

</h2>

<div id="losers">

Loading...

</div>

</div>

</section>

</main>

`;

}