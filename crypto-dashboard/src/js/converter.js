import { fetchUsdRate } from "./api.js";

let exchangeRate = null;

/* ---------------- Fetch Exchange Rate ---------------- */

export async function loadExchangeRate() {
  try {
    exchangeRate = await fetchUsdRate();

    if (!exchangeRate || exchangeRate <= 0) {
      exchangeRate = 87; // fallback
    }

    return exchangeRate;

  } catch (error) {

    console.error("Exchange Rate Error:", error);

    exchangeRate = 87; // fallback

    return exchangeRate;
  }
}

/* ---------------- Convert ---------------- */

export function convertUsdToInr(usd) {

  if (exchangeRate === null) {
    return 0;
  }

  return usd * exchangeRate;
}

/* ---------------- Format INR ---------------- */

export function formatInr(value) {

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value);

}

/* ---------------- Initialize Converter ---------------- */

export async function initializeConverter() {

  const usdInput = document.getElementById("usd");

  const convertBtn = document.getElementById("convertBtn");

  const result = document.getElementById("inrResult");

  if (!usdInput || !convertBtn || !result) return;

  await loadExchangeRate();

  function convert() {

    const usd = Number(usdInput.value);

    if (!usd || usd < 0) {

      result.textContent = "Enter a valid amount";

      return;

    }

    const inr = convertUsdToInr(usd);

    result.textContent = formatInr(inr);

  }

  convertBtn.addEventListener("click", convert);

  usdInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

      convert();

    }

  });

}