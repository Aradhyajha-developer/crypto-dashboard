export async function usdToInr(amount) {

  const res = await fetch(
    "https://open.er-api.com/v6/latest/USD"
  );

  if (!res.ok) {
    throw new Error("Exchange rate unavailable");
  }

  const data = await res.json();

  return amount * data.rates.INR;

}