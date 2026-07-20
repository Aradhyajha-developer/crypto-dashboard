import Chart from "chart.js/auto";


let chartInstance = null;




/*
================================
CREATE PRICE CHART
================================
*/

export function createChart(
    canvasId,
    historyData
){


    const canvas =
    document.getElementById(canvasId);



    if(!canvas){

        console.error(
            "Chart canvas not found"
        );

        return;

    }





    if(
        !historyData ||
        !historyData.prices ||
        historyData.prices.length === 0
    ){

        console.error(
            "No chart data available"
        );

        return;

    }





    /*
    Destroy previous chart
    */

    if(chartInstance){

        chartInstance.destroy();

        chartInstance = null;

    }






    const prices =
    historyData.prices.map(
        item => item[1]
    );





    const labels =
    historyData.prices.map(
        item => {


            const date =
            new Date(item[0]);


            return date.toLocaleDateString(
                "en-US",
                {
                    month:"short",
                    day:"numeric"
                }
            );


        }
    );







    const ctx =
    canvas.getContext("2d");







    chartInstance = new Chart(

        ctx,

        {


            type:"line",



            data:{


                labels,


                datasets:[

                    {


                        label:"Price USD",


                        data:prices,


                        borderWidth:3,


                        tension:0.4,


                        fill:true,


                        pointRadius:3,


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


                        display:true


                    },




                    tooltip:{


                        callbacks:{


                            label(context){


                                return (

                                    "$ " +

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


                    y:{


                        ticks:{


                            callback(value){


                                return (

                                    "$" +

                                    Number(value)
                                    .toLocaleString()

                                );


                            }


                        }


                    },



                    x:{


                        grid:{


                            display:false


                        }


                    }


                }




            }




        }


    );



}







/*
================================
DESTROY CHART
================================
*/


export function destroyChart(){


    if(chartInstance){


        chartInstance.destroy();


        chartInstance=null;


    }


}