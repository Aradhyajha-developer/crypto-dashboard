import Chart from "chart.js/auto";

let chart = null;

export function renderChart(history, coin) {

  const ctx = document.getElementById("priceChart");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {

    type: "line",

    data: {

      labels: history.prices.map(item =>
        new Date(item[0]).toLocaleDateString()
      ),

      datasets: [

        {

          label: `${coin} Price (USD)`,

          data: history.prices.map(item => item[1]),

          borderColor: "#2563eb",

          backgroundColor: "rgba(37,99,235,.15)",

          fill: true,

          tension: .4

        }

      ]

    },

    options: {

      responsive: true,

      maintainAspectRatio: false

    }

  });

}