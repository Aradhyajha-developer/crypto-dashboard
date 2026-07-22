const API = "https://api.coingecko.com/api/v3";

const CACHE = new Map();

const CACHE_TIME = {
  market: 60000,
  overview: 60000,
  coin: 30000,
  history: 30000,
  trending: 300000,
  exchange: 300000
};

function getCache(key) {
  const item = CACHE.get(key);

  if (!item) return null;

  if (Date.now() > item.expiry) {
    CACHE.delete(key);
    return null;
  }

  return item.data;
}

function setCache(key, data, ttl) {
  CACHE.set(key, {
    data,
    expiry: Date.now() + ttl
  });

  return data;
}

async function request(url, options = {}) {
  const {
    retries = 2,
    timeout = 10000
  } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!response.ok) {
        if (
          attempt < retries &&
          (response.status === 429 || response.status >= 500)
        ) {
          await new Promise(r =>
            setTimeout(r, 1000 * (attempt + 1))
          );

          continue;
        }

        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timer);

      if (attempt >= retries) {
        throw error;
      }

      await new Promise(r =>
        setTimeout(r, 1000 * (attempt + 1))
      );
    }
  }
}

/* ===============================
   SEARCH
================================ */

export async function searchCoin(query) {
  if (!query || !query.trim()) {
    return { coins: [] };
  }

  return request(
    `${API}/search?query=${encodeURIComponent(query.trim())}`
  );
}

/* ===============================
   COIN DETAILS
================================ */

export async function fetchCoin(id = "bitcoin") {
  const key = `coin-${id}`;

  const cached = getCache(key);

  if (cached) return cached;

  const data = await request(
    `${API}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  );

  return setCache(key, data, CACHE_TIME.coin);
}

/* ===============================
   HISTORY
================================ */

export async function fetchHistory(id = "bitcoin") {
  const key = `history-${id}`;

  const cached = getCache(key);

  if (cached) return cached;

  const data = await request(
    `${API}/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`
  );

  return setCache(key, data, CACHE_TIME.history);
}

/* ===============================
   MARKET
================================ */

export async function fetchMarket() {
  const cached = getCache("market");

  if (cached) return cached;

  const data = await request(
    `${API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
  );

  return setCache("market", data, CACHE_TIME.market);
}

/* ===============================
   MARKET OVERVIEW
================================ */

export async function fetchMarketOverview() {
  const cached = getCache("overview");

  if (cached) return cached;

  const data = await request(`${API}/global`);

  return setCache(
    "overview",
    data.data,
    CACHE_TIME.overview
  );
}

/* ===============================
   TOP GAINERS
================================ */

export async function fetchTopGainers(limit = 5) {
  const coins = await fetchMarket();

  return coins
    .filter(
      coin =>
        coin.price_change_percentage_24h != null
    )
    .sort(
      (a, b) =>
        b.price_change_percentage_24h -
        a.price_change_percentage_24h
    )
    .slice(0, limit);
}

/* ===============================
   TOP LOSERS
================================ */

export async function fetchTopLosers(limit = 5) {
  const coins = await fetchMarket();

  return coins
    .filter(
      coin =>
        coin.price_change_percentage_24h != null
    )
    .sort(
      (a, b) =>
        a.price_change_percentage_24h -
        b.price_change_percentage_24h
    )
    .slice(0, limit);
}

/* ===============================
   TRENDING
================================ */

export async function fetchTrendingCoins() {
  const cached = getCache("trending");

  if (cached) return cached;

  const data = await request(
    `${API}/search/trending`
  );

  const result =
    data.coins?.map(item => item.item) || [];

  return setCache(
    "trending",
    result,
    CACHE_TIME.trending
  );
}

/* ===============================
   SIMPLE PRICE
================================ */

export async function fetchSimplePrice(id) {
  return request(
    `${API}/simple/price?ids=${id}&vs_currencies=usd,inr`
  );
}

/* ===============================
   USD → INR
================================ */

export async function fetchUSDtoINR() {
  const cacheKey = "usd-inr-rate";

  try {
    const response = await fetch(
      "https://open.er-api.com/v6/latest/USD"
    );

    if (!response.ok) {
      throw new Error("Currency API Failed");
    }

    const data = await response.json();

    const rate = data?.rates?.INR ?? 83;

    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        rate,
        time: Date.now()
      })
    );

    return rate;
  } catch (error) {
    console.error(error);

    const saved = localStorage.getItem(cacheKey);

    if (saved) {
      try {
        return JSON.parse(saved).rate;
      } catch {}
    }

    return 83;
  }
}

/* ===============================
   EXCHANGE RATES
================================ */

export async function fetchExchangeRates() {
  const cached = getCache("exchange");

  if (cached) return cached;

  const data = await request(
    `${API}/exchange_rates`
  );

  return setCache(
    "exchange",
    data.rates,
    CACHE_TIME.exchange
  );
}

/* ===============================
   CHART
================================ */

export async function fetchChart(
  id,
  days = 7
) {
  return request(
    `${API}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  );
}

/* ===============================
   API HEALTH
================================ */

export async function checkAPI() {
  try {
    await fetchMarket();
    return true;
  } catch {
    return false;
  }
}

/* ===============================
   COMPATIBILITY
================================ */

export async function fetchUsdRate() {
  return fetchUSDtoINR();
}