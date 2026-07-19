const KEY = "crypto-favorites";

export function getFavorites() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function addFavorite(coin) {
  const favorites = getFavorites();

  if (!favorites.includes(coin)) {
    favorites.push(coin);
  }

  localStorage.setItem(KEY, JSON.stringify(favorites));
}

export function removeFavorite(coin) {
  const favorites = getFavorites().filter(item => item !== coin);

  localStorage.setItem(KEY, JSON.stringify(favorites));
}

export function isFavorite(coin) {
  return getFavorites().includes(coin);
}