/* ---------------- Currency ---------------- */

export function formatCurrency(value) {

  if (value === null || value === undefined) return "$0";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);

}

/* ---------------- Large Numbers ---------------- */

export function formatNumber(value) {

  if (value >= 1_000_000_000_000)
    return (value / 1_000_000_000_000).toFixed(2) + "T";

  if (value >= 1_000_000_000)
    return (value / 1_000_000_000).toFixed(2) + "B";

  if (value >= 1_000_000)
    return (value / 1_000_000).toFixed(2) + "M";

  if (value >= 1_000)
    return (value / 1_000).toFixed(2) + "K";

  return value.toString();

}

/* ---------------- Percent ---------------- */

export function formatPercent(value) {

  if (value === undefined || value === null)
    return "0%";

  return value.toFixed(2) + "%";

}

/* ---------------- Date ---------------- */

export function formatDate(timestamp) {

  return new Date(timestamp).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short"
    }
  );

}

/* ---------------- Error ---------------- */

export function showError(element, message) {

  if (!element) return;

  element.innerHTML = `
    <div class="error-card">
      <h3>⚠ Error</h3>
      <p>${message}</p>
    </div>
  `;

}

/* ---------------- Success ---------------- */

export function showSuccess(element, message) {

  if (!element) return;

  element.innerHTML = `
    <div class="success-card">
      <p>${message}</p>
    </div>
  `;

}

/* ---------------- Debounce ---------------- */

export function debounce(callback, delay = 500) {

  let timer;

  return (...args) => {

    clearTimeout(timer);

    timer = setTimeout(() => {

      callback(...args);

    }, delay);

  };

}

/* ---------------- Empty ---------------- */

export function isEmpty(value) {

  return value === null ||
         value === undefined ||
         value === "";

}

/* ---------------- Clamp ---------------- */

export function clamp(number, min, max) {

  return Math.min(
    Math.max(number, min),
    max
  );

}

/* ---------------- Random ID ---------------- */

export function randomId() {

  return Math.random()
    .toString(36)
    .substring(2, 10);

}