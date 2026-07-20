import {
    fetchMarketOverview,
    fetchTopGainers,
    fetchTopLosers
} from "./api.js";


import {
    formatCurrency,
    formatPercent,
    showError
} from "./utils.js";



/* ==========================
   Helper
========================== */


function setText(id, value){

    const element =
    document.getElementById(id);


    if(element){

        element.textContent = value;

    }

}





/* ==========================
   Market Overview
========================== */


export async function loadMarketOverview(){


    try{


        const market =
        await fetchMarketOverview();



        setText(

            "marketCap",

            formatCurrency(
                market.total_market_cap.usd
            )

        );



        setText(

            "marketVolume",

            formatCurrency(
                market.total_volume.usd
            )

        );



        setText(

            "btcDom",

            formatPercent(
                market.market_cap_percentage.btc
            )

        );



        setText(

            "ethDom",

            formatPercent(
                market.market_cap_percentage.eth
            )

        );


    }

    catch(error){


        console.error(
            "Market overview error",
            error
        );


        setText(
            "marketCap",
            "--"
        );


        setText(
            "marketVolume",
            "--"
        );


        setText(
            "btcDom",
            "--"
        );


        setText(
            "ethDom",
            "--"
        );


    }


}







/* ==========================
   Render Coin List
========================== */


function renderCoins(
    elementId,
    coins
){


    const list =
    document.getElementById(
        elementId
    );



    if(!list)
    return;



    list.innerHTML="";



    coins.forEach(
        coin=>{


            const change =
            Number(
                coin.price_change_percentage_24h || 0
            );



            const li =
            document.createElement(
                "li"
            );



            li.innerHTML = `

            <div class="coin-row">


                <div class="coin-info">


                    <img

                    src="${coin.image}"

                    width="30"

                    height="30"

                    >


                    <span>

                    ${coin.name}

                    </span>


                </div>



                <div class="coin-price">


                    <strong>

                    ${formatCurrency(
                        coin.current_price
                    )}

                    </strong>



                    <small class="${
                        change >=0
                        ?
                        "positive"
                        :
                        "negative"
                    }">

                    ${
                        change>=0
                        ?
                        "+"
                        :
                        ""
                    }

                    ${change.toFixed(2)}%

                    </small>


                </div>


            </div>

            `;



            list.appendChild(li);



        }

    );



}







/* ==========================
   Gainers
========================== */


export async function loadTopGainers(){


    try{


        const coins =
        await fetchTopGainers();



        renderCoins(
            "gainers",
            coins
        );


    }

    catch(error){


        console.error(
            error
        );


        showError(

            document.getElementById(
                "gainers"
            ),

            "Unable to load gainers"

        );


    }


}







/* ==========================
   Losers
========================== */


export async function loadTopLosers(){


    try{


        const coins =
        await fetchTopLosers();



        renderCoins(
            "losers",
            coins
        );


    }

    catch(error){


        console.error(
            error
        );


        showError(

            document.getElementById(
                "losers"
            ),

            "Unable to load losers"

        );


    }


}







/* ==========================
   MAIN MARKET LOADER
========================== */


export async function loadMarketWidgets(){


    await Promise.all([

        loadMarketOverview(),

        loadTopGainers(),

        loadTopLosers()

    ]);


}