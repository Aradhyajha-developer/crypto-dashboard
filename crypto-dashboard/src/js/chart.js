import Chart from "chart.js/auto";


let chartInstance = null;



/*
================================
THEME CHECK
================================
*/

function isDarkMode(){

return document.body.classList.contains("dark");

}



/*
================================
CREATE CHART
================================
*/


export function createChart(
canvasId,
historyData
){


try{


const canvas =
document.getElementById(canvasId);



if(!canvas){

console.error(
"Chart canvas not found"
);

return;

}



const ctx =
canvas.getContext("2d");



if(!ctx){

console.error(
"Canvas unavailable"
);

return;

}



if(
!historyData ||
!Array.isArray(historyData.prices) ||
historyData.prices.length===0
){

console.error(
"No chart data"
);

destroyChart();

return;

}



destroyChart();




const labels =
historyData.prices.map(
([time])=>

new Date(time)
.toLocaleDateString(
"en-US",
{
month:"short",
day:"numeric"
}

)

);




const prices =
historyData.prices.map(
([,price])=>price
);




const dark =
isDarkMode();





chartInstance =
new Chart(
ctx,
{


type:"line",



data:{


labels,



datasets:[

{


label:"Price USD",


data:prices,


borderColor:
"#2563eb",



backgroundColor:
"rgba(37,99,235,0.15)",



fill:true,



borderWidth:3,



tension:0.4,



pointRadius:2,



pointHoverRadius:6



}


]


},




options:{


responsive:true,


maintainAspectRatio:false,



interaction:{


mode:"index",

intersect:false


},




plugins:{



legend:{


display:true,


labels:{


color:
dark
?
"#e2e8f0"
:
"#334155"


}


},




tooltip:{


callbacks:{


label(context){


return (

"$" +

Number(
context.raw
)
.toLocaleString()

);


}


}


}


},






scales:{



x:{


ticks:{


color:
dark
?
"#cbd5e1"
:
"#64748b",



maxTicksLimit:7


},



grid:{


display:false


}


},





y:{


ticks:{


color:
dark
?
"#cbd5e1"
:
"#64748b",



callback(value){


return (

"$"+

Number(value)
.toLocaleString()

);


}


},



grid:{


color:
dark
?
"rgba(255,255,255,.08)"
:
"rgba(0,0,0,.08)"


}



}


}



}




}


);



}

catch(error){


console.error(
"Chart Error:",
error
);


}


}







/*
================================
UPDATE
================================
*/


export function updateChart(
canvasId,
historyData
){

createChart(
canvasId,
historyData
);


}







/*
================================
DESTROY
================================
*/


export function destroyChart(){


if(chartInstance){


chartInstance.destroy();


chartInstance=null;


}


}