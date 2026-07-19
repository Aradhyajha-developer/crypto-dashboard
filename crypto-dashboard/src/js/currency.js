const API =
"https://api.exchangerate-api.com/v4/latest/USD";


export async function convertUSD(amount){

const res =
await fetch(API);


const data =
await res.json();


return amount * data.rates.INR;

}