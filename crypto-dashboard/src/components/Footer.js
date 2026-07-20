export default function Footer(){

const year=new Date().getFullYear();

return`

<footer class="footer">

<div>

<h3>CryptoDash</h3>

<p>

Real-Time Cryptocurrency Dashboard

</p>

</div>

<div>

<p>

Powered by CoinGecko API

</p>

<p>

© ${year} CryptoDash

</p>

</div>

</footer>

`;

}