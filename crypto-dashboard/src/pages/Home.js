export default function Home() {

return `

<div class="dashboard-container">


<!-- HERO -->

<section class="hero">

<h1>
Crypto Market Dashboard
</h1>


<p>
Track live cryptocurrency prices, market trends and favorites.
</p>



<div class="search-box">


<input

id="search"

type="text"

placeholder="Search Bitcoin, Ethereum..."

autocomplete="off"

spellcheck="false"

/>



<button id="searchBtn">

Search

</button>



</div>


<div 
id="suggestions"
class="suggestions">
</div>


</section>





<!-- COIN RESULT -->


<section class="section">


<div id="results">


<div class="placeholder-card">

Search a cryptocurrency to view details

</div>


</div>


</section>







<!-- MARKET OVERVIEW -->


<section class="section">


<h2>
Market Overview
</h2>



<div class="market-grid">



<div class="market-card">

<h3>
Market Cap
</h3>

<p id="marketCap">
--
</p>

</div>





<div class="market-card">

<h3>
24h Volume
</h3>

<p id="marketVolume">
--
</p>

</div>





<div class="market-card">

<h3>
BTC Dominance
</h3>

<p id="btcDom">
--
</p>

</div>





<div class="market-card">

<h3>
ETH Dominance
</h3>

<p id="ethDom">
--
</p>

</div>



</div>


</section>







<!-- GAINERS LOSERS -->


<section class="widgets">



<div class="widget">


<h2>
Top Gainers 🚀
</h2>


<ul id="gainers">

</ul>


</div>





<div class="widget">


<h2>
Top Losers 📉
</h2>


<ul id="losers">

</ul>


</div>



</section>







<!-- CHART -->


<section class="chart-card">


<h2>
7 Day Price Chart
</h2>


<div class="chart-container">


<canvas id="priceChart"></canvas>


</div>



</section>








<!-- CONVERTER -->


<section class="section">


<h2>
USD → INR Converter
</h2>



<div class="converter-box">


<input

id="usd"

type="number"

min="0"

placeholder="Enter USD"

/>




<button id="convertBtn">

Convert

</button>


</div>



<p id="usdRate">

</p>


<h3 id="inrResult">

</h3>


</section>








<!-- FAVORITES -->


<section class="section">


<h2>
⭐ Favorites
</h2>



<ul id="favList">

</ul>



</section>




</div>

`;

}