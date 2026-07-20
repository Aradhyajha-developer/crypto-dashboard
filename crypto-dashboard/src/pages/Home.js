export default function Home(){

return `

<main class="dashboard-container">


<!-- HERO SEARCH -->

<section class="hero">


<div class="hero-content">


<h1>
🚀 CryptoDash
</h1>


<p>

Track live cryptocurrency prices,
market trends and your favorite coins.

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



<div

id="suggestions"

class="suggestions"

></div>


</div>


</section>







<!-- MARKET OVERVIEW -->


<section class="section">


<h2>
📊 Market Overview
</h2>



<div class="market-grid">


<div class="market-card">

<h3>
Total Market Cap
</h3>

<p id="marketCap">
Loading...
</p>

</div>




<div class="market-card">

<h3>
24H Volume
</h3>

<p id="marketVolume">
Loading...
</p>

</div>




<div class="market-card">

<h3>
BTC Dominance
</h3>

<p id="btcDom">
Loading...
</p>

</div>




<div class="market-card">

<h3>
ETH Dominance
</h3>

<p id="ethDom">
Loading...
</p>

</div>



</div>


</section>









<!-- COIN DETAILS -->


<section class="section">


<h2>
🪙 Coin Details
</h2>


<div id="results">


<div class="placeholder-card">


<h2>
Search Any Coin
</h2>


<p>

Get live price,
market cap and details.

</p>


</div>


</div>


</section>









<!-- CHART -->


<section class="section">


<h2>
📈 7 Day Price Chart
</h2>



<div class="chart-card chart-container">


<canvas id="priceChart"></canvas>


</div>



</section>









<!-- GAINERS LOSERS -->


<section class="widgets">


<div class="widget">


<h2>
🔥 Top Gainers
</h2>



<ul id="gainers">

<li>
Loading...
</li>

</ul>



</div>





<div class="widget">


<h2>
📉 Top Losers
</h2>



<ul id="losers">

<li>
Loading...
</li>

</ul>



</div>



</section>









<!-- CONVERTER -->


<section class="section">


<h2>
💱 USD → INR Converter
</h2>



<div class="converter-box">


<input

id="usd"

type="number"

placeholder="Enter USD"

/>



<button id="convertBtn">

Convert

</button>




<h3 id="inrResult">

₹0

</h3>



</div>


</section>









<!-- FAVORITES -->


<section class="section">


<h2>
⭐ My Favorites
</h2>



<ul id="favList">


<li>
No favorites yet
</li>


</ul>



</section>









<!-- LOADER -->


<div

id="loader"

class="loader hidden"

>


<div class="spinner">

</div>


</div>





</main>


`;

}