import { usdToInr } from "./currency.js";

const amount = document.getElementById("amount");
const btn = document.getElementById("convertBtn");
const output = document.getElementById("converted");

btn?.addEventListener("click", async () => {

  const value = Number(amount.value);

  if (!value || value <= 0) {

    output.textContent = "Enter a valid USD amount.";
    return;

  }

  output.textContent = "Converting...";

  try {

    const result = await usdToInr(value);

    output.innerHTML = `

      <strong>

      ₹ ${result.toLocaleString(undefined, {
        maximumFractionDigits: 2
      })}

      </strong>

    `;

  } catch (err) {

    output.textContent = "Conversion failed.";

    console.error(err);

  }

});