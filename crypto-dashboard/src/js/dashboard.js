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




/* ==========================
   INIT
========================== */


export async function initDashboard(){


    initializeTheme();


    await loadMarketWidgets();


    await initializeConverter();


    setupSearch();


    await renderFavorites();


    await restoreLastCoin();


}





/* ==========================
   SEARCH
========================== */


function setupSearch(){


    if(!searchInput)
    return;



    searchInput.addEventListener(

        "input",

        debounce(

            async(e)=>{


                const value =
                e.target.value.trim();



                if(!value){

                    suggestions.innerHTML="";

                    return;

                }



                await showSuggestions(value);


            },

            400

        )

    );





    searchBtn?.addEventListener(

        "click",

        ()=>{


            const value =
            searchInput.value.trim();



            if(value){

                loadCoin(value.toLowerCase());

                suggestions.innerHTML="";

            }


        }

    );





    searchInput.addEventListener(

        "keypress",

        (e)=>{


            if(e.key==="Enter"){


                const value =
                searchInput.value.trim();



                if(value){

                    loadCoin(value.toLowerCase());

                    suggestions.innerHTML="";

                }


            }


        }

    );


}






/* ==========================
   SUGGESTIONS
========================== */


async function showSuggestions(query){


    try{


        const data =
        await searchCoin(query);



        suggestions.innerHTML="";



        data.coins
        .slice(0,5)
        .forEach(coin=>{


            const div =
            document.createElement("div");



            div.className =
            "suggestion-item";



            div.innerHTML = `

            <img src="${coin.thumb}" width="25">

            <span>
            ${coin.name}
            (${coin.symbol.toUpperCase()})
            </span>

            `;



            div.onclick = ()=>{


                searchInput.value =
                coin.name;



                loadCoin(
                    coin.id
                );



                suggestions.innerHTML="";


            };



            suggestions.appendChild(div);



        });



    }

    catch(error){

        console.log(error);

    }


}






/* ==========================
   LOAD COIN
========================== */


async function loadCoin(id){


    try{


        showLoader();



        const coin =
        await fetchCoin(id);



        currentCoin =
        coin;



        localStorage.setItem(
            "lastCoin",
            coin.id
        );



        renderCoin(
            coin
        );



        await loadChart(
            coin.id
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
            "Coin load failed"
        );


    }


}






/* ==========================
   RENDER COIN
========================== */


function renderCoin(coin){


    const market =
    coin.market_data;



    results.innerHTML = `

    <div class="card coin-card">


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



        <p class="${
            market.price_change_percentage_24h >= 0
            ?
            "positive"
            :
            "negative"
        }">

        ${formatPercent(
            market.price_change_percentage_24h
        )}

        </p>



        <button id="favoriteBtn">

        ${
            isFavorite(coin.id)
            ?
            "⭐ Remove Favorite"
            :
            "☆ Add Favorite"
        }

        </button>


    </div>

    `;




    document
    .getElementById("favoriteBtn")
    ?.addEventListener(

        "click",

        ()=>{


            if(
                isFavorite(coin.id)
            ){

                removeFavorite(
                    coin.id
                );


            }
            else{


                saveFavorite(
                    coin.id
                );


            }



            renderCoin(
                coin
            );


            renderFavorites();


        }

    );


}







/* ==========================
   CHART
========================== */


async function loadChart(id){


    try{


        destroyChart();



        const history =
        await fetchHistory(id);



        createChart(
            "priceChart",
            history
        );


    }


    catch(error){


        console.log(
            "Chart error",
            error
        );


        destroyChart();


    }


}







/* ==========================
   FAVORITES
========================== */


async function renderFavorites(){


    if(!favList)
    return;



    const favorites =
    getFavorites();



    favList.innerHTML="";



    if(
        favorites.length===0
    ){


        favList.innerHTML =
        "<li>No favorites yet ⭐</li>";

        return;


    }




    for(
        const id of favorites
    ){


        try{


            const coin =
            await fetchCoin(id);



            const li =
            document.createElement("li");



            li.innerHTML = `


            <span>

            ${coin.name}

            </span>


            <strong>

            ${formatCurrency(
                coin.market_data.current_price.usd
            )}

            </strong>


            <button
            class="remove-fav"
            data-id="${id}"
            >

            ❌

            </button>


            `;



            favList.appendChild(
                li
            );


        }

        catch(error){

            console.log(error);

        }


    }


}






favList?.addEventListener(

    "click",

    (e)=>{


        if(
            e.target.classList.contains(
                "remove-fav"
            )
        ){


            removeFavorite(
                e.target.dataset.id
            );



            renderFavorites();


        }


    }

);







/* ==========================
   RESTORE LAST COIN
========================== */


async function restoreLastCoin(){


    const last =
    localStorage.getItem(
        "lastCoin"
    );



    if(last){

        await loadCoin(last);


    }
    else{


        await loadCoin(
            "bitcoin"
        );


    }


}