import {
    searchCoin,
    fetchCoin,
    fetchHistory
} from "./api.js";


import {
    saveFavorite,
    removeFavorite,
    getFavorites,
    isFavorite
} from "./storage.js";


import {
    createChart,
    destroyChart
} from "./chart.js";


import {
    loadMarketWidgets
} from "./market.js";


import {
    initializeConverter
} from "./converter.js";


import {
    initializeTheme
} from "./theme.js";


import {
    showLoader,
    hideLoader
} from "./loader.js";


import {
    formatCurrency,
    formatPercent,
    debounce,
    showError
} from "./utils.js";



/*
==============================
DOM
==============================
*/


const searchInput =
document.getElementById("search");


const searchBtn =
document.getElementById("searchBtn");


const suggestions =
document.getElementById("suggestions");


const results =
document.getElementById("results");


const favList =
document.getElementById("favList");



let currentCoin = null;





/*
==============================
APP START
==============================
*/


async function initDashboard(){

    try{


        initializeTheme();


        await loadMarketWidgets();


        initializeConverter();


        renderFavorites();


        setupSearch();


        await restoreLastCoin();



    }
    catch(error){

        console.error(
            "Dashboard Error:",
            error
        );

    }


}







/*
==============================
SEARCH
==============================
*/


function setupSearch(){


    if(!searchInput)
    return;




    searchInput.addEventListener(

        "input",

        debounce(async(e)=>{


            const value =
            e.target.value.trim();



            if(!value){

                suggestions.innerHTML="";

                return;

            }



            const data =
            await searchCoin(value);



            suggestions.innerHTML="";



            (data.coins || [])
            .slice(0,5)
            .forEach(coin=>{


                const item =
                document.createElement("div");



                item.className =
                "suggestion-item";



                item.innerHTML = `

                <img
                src="${coin.thumb}"
                width="25"
                >

                ${coin.name}
                (${coin.symbol.toUpperCase()})

                `;



                item.onclick=()=>{

                    loadCoin(
                        coin.id
                    );


                    suggestions.innerHTML="";

                };



                suggestions.appendChild(item);


            });



        },400)

    );





    if(searchBtn){


        searchBtn.onclick=()=>{


            const value =
            searchInput.value.trim();



            if(value){

                loadCoin(value.toLowerCase());

            }


        };


    }



}








/*
==============================
LOAD COIN
==============================
*/


async function loadCoin(id){


    try{


        showLoader();



        const coin =
        await fetchCoin(id);



        currentCoin = coin;



        localStorage.setItem(
            "lastCoin",
            coin.id
        );



        renderCoin(coin);



        const history =
        await fetchHistory(
            coin.id
        );



        createChart(
            "priceChart",
            history
        );



        hideLoader();



    }


    catch(error){


        console.error(
            error
        );


        hideLoader();



        showError(
            results,
            "Unable to load coin."
        );



        destroyChart();


    }


}







/*
==============================
RENDER COIN
==============================
*/


function renderCoin(coin){


    const market =
    coin.market_data;



    const favorite =
    isFavorite(
        coin.id
    );



    results.innerHTML = `


    <div class="coin-card">


        <img

        src="${coin.image.large}"

        width="80"

        >


        <h2>

        ${coin.name}
        (${coin.symbol.toUpperCase()})

        </h2>


        <h1>

        ${formatCurrency(
            market.current_price.usd
        )}

        </h1>



        <p>

        ${
        formatPercent(
        market.price_change_percentage_24h
        )
        }

        </p>




        <button id="favoriteBtn">


        ${
        favorite
        ?
        "⭐ Remove Favorite"
        :
        "☆ Add Favorite"
        }


        </button>



    </div>



    `;



    setupFavorite(
        coin.id
    );


}








/*
==============================
FAVORITE
==============================
*/


function setupFavorite(id){


    const btn =
    document.getElementById(
        "favoriteBtn"
    );



    if(!btn)
    return;



    btn.onclick=()=>{


        if(isFavorite(id)){


            removeFavorite(id);


        }
        else{


            saveFavorite(id);


        }



        renderFavorites();



        if(currentCoin){

            renderCoin(
                currentCoin
            );

        }



    };


}








/*
==============================
FAVORITES
==============================
*/


async function renderFavorites(){


    if(!favList)
    return;



    const favorites =
    getFavorites();



    if(favorites.length===0){


        favList.innerHTML = `

        <li>
        No favorites yet ⭐
        </li>

        `;


        return;

    }





    favList.innerHTML="";




    for(
        const id of favorites
    ){


        try{


            const coin =
            await fetchCoin(id);



            const li =
            document.createElement("li");



            li.innerHTML = `

            ${coin.name}

            -

            ${formatCurrency(
            coin.market_data.current_price.usd
            )}


            <button data-id="${id}">
            ❌
            </button>


            `;



            favList.appendChild(li);



        }
        catch(error){

            console.log(error);

        }


    }


}








/*
==============================
RESTORE
==============================
*/


async function restoreLastCoin(){


    const last =
    localStorage.getItem(
        "lastCoin"
    );



    await loadCoin(
        last || "bitcoin"
    );


}







/*
==============================
START
==============================
*/


document.addEventListener(

"DOMContentLoaded",

()=>{

    initDashboard();

}

);