import {
    fetchUsdRate
} from "./api.js";


let usdRate = 83;



export async function initializeConverter(){

    const input =
    document.getElementById("usd");


    const button =
    document.getElementById("convertBtn");


    const result =
    document.getElementById("inrResult");



    if(!input || !button || !result){

        return;

    }



    try{

        usdRate =
        await fetchUsdRate();

    }
    catch(error){

        console.log(
            "Using fallback rate"
        );

    }




    button.addEventListener(
        "click",
        ()=>{


            const usd =
            Number(input.value);



            if(!usd || usd <=0){

                result.textContent =
                "Enter valid USD";

                return;

            }



            const inr =
            usd * usdRate;



            result.textContent =
            "₹ " +
            inr.toLocaleString(
                "en-IN",
                {
                    maximumFractionDigits:2
                }
            );


        }

    );


}