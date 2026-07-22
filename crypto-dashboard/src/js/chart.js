import Chart from "chart.js/auto";

let chartInstance = null;

/*
================================
HELPER
================================
*/

function isDarkMode() {
  return document.documentElement.classList.contains("dark");
}

/*
================================
CREATE CHART
================================
*/

export function createChart(canvasId, historyData) {
  try {
    const canvas = document.getElementById(canvasId);

    if (!canvas) {
      console.error("Chart canvas not found.");
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("Canvas context unavailable.");
      return;
    }

    if (
      !historyData ||
      !Array.isArray(historyData.prices) ||
      historyData.prices.length === 0
    ) {
      console.error("No chart data available.");
      destroyChart();
      return;
    }

    destroyChart();

    const labels = historyData.prices.map(([time]) =>
      new Date(time).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    );

    const prices = historyData.prices.map(([, price]) => price);

    const dark = isDarkMode();

    chartInstance = new Chart(ctx, {
      type: "line",

      data: {
        labels,

        datasets: [
          {
            label: "Price (USD)",

            data: prices,

            borderColor: "#3b82f6",

            backgroundColor: "rgba(59,130,246,.15)",

            fill: true,

            borderWidth: 3,

            tension: 0.4,

            pointRadius: 3,

            pointHoverRadius: 6,

            pointBackgroundColor: "#3b82f6",
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        animation: {
          duration: 600,
        },

        interaction: {
          intersect: false,
          mode: "index",
        },

        plugins: {
          legend: {
            display: true,
            labels: {
              color: dark ? "#ffffff" : "#222222",
            },
          },

          tooltip: {
            callbacks: {
              label(context) {
                return `$${Number(context.raw).toLocaleString()}`;
              },
            },
          },
        },

        scales: {
          x: {
            ticks: {
              color: dark ? "#ffffff" : "#555555",
            },

            grid: {
              color: dark
                ? "rgba(255,255,255,.08)"
                : "rgba(0,0,0,.08)",
            },
          },

          y: {
            ticks: {
              color: dark ? "#ffffff" : "#555555",

              callback(value) {
                return "$" + Number(value).toLocaleString();
              },
            },

            grid: {
              color: dark
                ? "rgba(255,255,255,.08)"
                : "rgba(0,0,0,.08)",
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Chart Error:", error);
  }
}

/*
================================
UPDATE CHART
================================
*/

export function updateChart(canvasId, historyData) {
  createChart(canvasId, historyData);
}

/*
================================
DESTROY CHART
================================
*/

export function destroyChart() {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
}