import Chart from "chart.js/auto";

let chart = null;

export function createChart(history) {

  const canvas = document.getElementById("priceChart");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

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

          label: "Price (USD)",

          data: history.prices.map(item => item[1]),

          borderColor: "#2563eb",

          backgroundColor: "rgba(37,99,235,.15)",

          fill: true,

          tension: .4,

          pointRadius: 2

        }

      ]

    },

    options: {

      responsive: true,

      maintainAspectRatio: false,

      plugins: {

        legend: {

          display: true

        }

      },

      scales: {

        y: {

          beginAtZero: false

        }

      }

    }

  });

}