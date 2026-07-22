import {
  fetchUsdRate
} from "./api.js";

let usdRate = 83;
let initialized = false;

/*
================================
FORMAT INR
================================
*/

function formatINR(value) {
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  });
}

/*
================================
CONVERT
================================
*/

function convert(input, result) {
  const usd = Number(input.value.trim());

  if (!input.value.trim()) {
    result.textContent = "Please enter USD amount.";
    return;
  }

  if (isNaN(usd) || usd <= 0) {
    result.textContent = "Enter a valid USD amount.";
    return;
  }

  const inr = usd * usdRate;

  result.textContent = formatINR(inr);
}

/*
================================
INITIALIZE CONVERTER
================================
*/

export async function initializeConverter() {
  if (initialized) return;

  initialized = true;

  const input = document.getElementById("usd");
  const button = document.getElementById("convertBtn");
  const result = document.getElementById("inrResult");
  const rateLabel = document.getElementById("usdRate");

  if (!input || !button || !result) {
    console.warn("Converter elements not found.");
    return;
  }

  button.disabled = true;
  button.textContent = "Loading...";

  try {
    usdRate = await fetchUsdRate();

    if (rateLabel) {
      rateLabel.textContent = `1 USD = ₹${usdRate.toFixed(2)}`;
    }
  } catch (error) {
    console.error("Using fallback exchange rate.", error);

    if (rateLabel) {
      rateLabel.textContent = `Using fallback rate (₹${usdRate})`;
    }
  }

  button.disabled = false;
  button.textContent = "Convert";

  button.addEventListener("click", () => {
    convert(input, result);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      convert(input, result);
    }
  });

  input.addEventListener("input", () => {
    if (result.textContent) {
      result.textContent = "";
    }
  });
}

/*
================================
GET CURRENT RATE
================================
*/

export function getUsdRate() {
  return usdRate;
}