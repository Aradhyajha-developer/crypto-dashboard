export function showLoader(){

const loader =
document.getElementById("loader");


loader.innerHTML = `

<div class="spinner">

</div>

<p>
Loading market data...
</p>

`;

}



export function hideLoader(){

const loader =
document.getElementById("loader");


loader.innerHTML = "";

}