import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

let chart = null;

/* ---------------- Create Chart ---------------- */

export function createChart(canvas, history, coinName = "Bitcoin") {

    if (!canvas || !history?.prices) return;

    const ctx = canvas.getContext("2d");

    if (chart) {
        chart.destroy();
    }

    const labels = history.prices.map(item =>
        new Date(item[0]).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short"
        })
    );

    const prices = history.prices.map(item => item[1]);

    chart = new Chart(ctx, {

        type: "line",

        data: {

            labels,

            datasets: [

                {

                    label: `${coinName} Price (USD)`,

                    data: prices,

                    borderColor: "#2563eb",

                    backgroundColor: "rgba(37,99,235,.15)",

                    fill: true,

                    tension: .35,

                    pointRadius: 3,

                    pointHoverRadius: 6,

                    borderWidth: 3

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {

                intersect: false,

                mode: "index"

            },

            plugins: {

                legend: {

                    display: true

                },

                tooltip: {

                    callbacks: {

                        label(context) {

                            return "$" +
                                Number(context.raw).toLocaleString();

                        }

                    }

                }

            },

            scales: {

                x: {

                    grid: {

                        display: false

                    }

                },

                y: {

                    ticks: {

                        callback(value) {

                            return "$" +
                                Number(value).toLocaleString();

                        }

                    }

                }

            }

        }

    });

}

/* ---------------- Update Chart ---------------- */

export function updateChart(canvas, history, coinName) {

    createChart(canvas, history, coinName);

}

/* ---------------- Destroy ---------------- */

export function destroyChart() {

    if (chart) {

        chart.destroy();

        chart = null;

    }

}