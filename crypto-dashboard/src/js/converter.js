window.addEventListener("DOMContentLoaded", () => {

  const usdInput = document.getElementById("usd");
  const convertBtn = document.getElementById("convertBtn");
  const result = document.getElementById("inrResult");

  if (!usdInput || !convertBtn || !result) return;

  const RATE = 87; // Static rate for now

  convertBtn.addEventListener("click", () => {

    const usd = Number(usdInput.value);

    if (isNaN(usd) || usd <= 0) {
      result.textContent = "Enter a valid amount";
      return;
    }

    const inr = usd * RATE;

    result.textContent = `₹ ${inr.toLocaleString("en-IN")}`;

  });

});