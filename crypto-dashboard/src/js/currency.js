import { fetchUSDtoINR } from "./api.js";

let currentRate = 83;

export async function getCurrentRate() {
  try {
    currentRate = await fetchUSDtoINR();
    return currentRate;
  } catch (err) {
    console.error("Currency API Error:", err);
    return currentRate;
  }
}

export async function convertUSDToINR(amount) {
  const rate = await getCurrentRate();
  return amount * rate;
}

export async function convertINRToUSD(amount) {
  const rate = await getCurrentRate();
  return amount / rate;
}

export function formatCurrency(value, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency
  }).format(value);
}

export function getOfflineRate() {
  return currentRate;
}