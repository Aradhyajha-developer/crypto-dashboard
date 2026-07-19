export function Home(){

return `


<section class="dashboard container">


<div class="hero">


<h1>
🚀 CryptoDash
</h1>


<p>
Track real-time cryptocurrency prices,
charts and market trends.
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



<div id="suggestions"></div>


</div>






<section class="dashboard-grid">





<!-- Coin Details -->

<div class="card">


<h3>
💰 Coin Details
</h3>



<div id="loader"></div>



<div id="results">

Search a coin to view details

</div>


</div>







<!-- Chart -->


<div class="card">


<h3>
📈 Price History
</h3>



<canvas id="priceChart">

</canvas>


</div>









<!-- Gainers -->


<div class="card">


<h3>
🔥 Top Gainers
</h3>



<div id="gainers">

Loading...

</div>



</div>







<!-- Losers -->


<div class="card">


<h3>
📉 Top Losers
</h3>



<div id="losers">

Loading...

</div>



</div>









<!-- Favorites -->


<div class="card">


<h3>
⭐ My Favorites
</h3>



<ul id="favList">

</ul>



</div>









<!-- Converter -->


<div class="card converter">


<h3>
💱 USD → INR
</h3>



<input

type="number"

id="usd"

placeholder="Enter USD amount"

>



<h2 id="inr">

₹0

</h2>



</div>





</section>


</section>



`;

}