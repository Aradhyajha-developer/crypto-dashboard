const API = "https://api.coingecko.com/api/v3";

const CACHE = new Map();

const CACHE_TIME = {
  market: 300000,
  overview: 300000,
  coin: 60000,
  history: 60000,
  trending: 300000,
  exchange: 300000,
  usdInr: 3600000
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
  const { retries = 2, timeout = 10000, signal } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: signal || controller.signal,
        headers: {
          Accept: "application/json"
        }
      });

      clearTimeout(timer);

      if (!response.ok) {
        if (response.status === 429 && attempt < retries) {
          const delay = 1000 * (attempt + 1);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        throw new Error(`API Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timer);

      if (error.name === "AbortError") {
        throw error;
      }

      if (attempt >= retries) {
        throw error;
      }

      const delay = 1000 * (attempt + 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

export async function searchCoin(query, options = {}) {
  if (!query?.trim()) return { coins: [] };

  try {
    const data = await request(
      `${API}/search?query=${encodeURIComponent(query.trim())}`,
      options
    );

    return {
      coins: (data?.coins || []).map((coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        thumb: coin.thumb,
        large: coin.large
      }))
    };
  } catch (error) {
    console.error("Search error:", error);
    return { coins: [] };
  }
}

export async function fetchCoin(id = "bitcoin") {
  const key = `coin-${id}`;
  const cached = getCache(key);

  if (cached) return cached;

  try {
    const data = await request(
      `${API}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );

    if (!data?.id || !data?.market_data) {
      throw new Error("Invalid coin data");
    }

    return setCache(key, data, CACHE_TIME.coin);
  } catch (error) {
    console.error(`Failed to fetch coin ${id}:`, error);
    throw new Error("Unable to load coin data");
  }
}

export async function fetchHistory(id = "bitcoin") {
  const key = `history-${id}`;
  const cached = getCache(key);

  if (cached) return cached;

  try {
    const data = await request(
      `${API}/coins/${id}/market_chart?vs_currency=usd&days=7`
    );

    if (!data?.prices?.length) {
      throw new Error("No chart data");
    }

    return setCache(key, data, CACHE_TIME.history);
  } catch (error) {
    console.error(`Chart fetch failed for ${id}:`, error);
    throw error;
  }
}

export async function fetchMarket() {
  const cached = getCache("market");
  if (cached) return cached;

  try {
    const data = await request(
      `${API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
    );

    if (!Array.isArray(data)) throw new Error("Invalid market data");

    return setCache("market", data, CACHE_TIME.market);
  } catch (error) {
    console.error("Market fetch failed:", error);
    throw error;
  }
}

export async function fetchMarketOverview() {
  const cached = getCache("overview");
  if (cached) return cached;

  try {
    const data = await request(`${API}/global`);

    if (!data?.data) throw new Error("Invalid overview data");

    return setCache("overview", data.data, CACHE_TIME.overview);
  } catch (error) {
    console.error("Overview fetch failed:", error);
    throw error;
  }
}

export async function fetchTopGainers(limit = 5) {
  try {
    const coins = await fetchMarket();

    return coins
      .filter((coin) => coin.price_change_percentage_24h != null)
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, limit);
  } catch (error) {
    console.error("Gainers fetch failed:", error);
    return [];
  }
}

export async function fetchTopLosers(limit = 5) {
  try {
    const coins = await fetchMarket();

    return coins
      .filter((coin) => coin.price_change_percentage_24h != null)
      .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
      .slice(0, limit);
  } catch (error) {
    console.error("Losers fetch failed:", error);
    return [];
  }
}

export async function fetchUSDtoINR() {
  const cached = getCache("usdInr");
  if (cached) return cached;

  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    const rate = data?.rates?.INR || 83;
    return setCache("usdInr", rate, CACHE_TIME.usdInr);
  } catch (error) {
    console.warn("USD to INR fetch failed, using fallback rate.");
    return 83;
  }
}

export async function fetchUsdRate() {
  return fetchUSDtoINR();
}

export async function fetchChart(id, days = 7) {
  return fetchHistory(id);
}

export async function checkAPI() {
  try {
    await fetchMarket();
    return true;
  } catch (error) {
    console.error("API check failed:", error);
    return false;
  }
}