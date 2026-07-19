const KEY = "favorites";

export function getFavorites() {

  return JSON.parse(

    localStorage.getItem(KEY)

  ) || [];

}

export function saveFavorite(id) {

  const favorites = getFavorites();

  if (!favorites.includes(id)) {

    favorites.push(id);

    localStorage.setItem(

      KEY,

      JSON.stringify(favorites)

    );

  }

}

export function removeFavorite(id) {

  const updated = getFavorites().filter(

    coin => coin !== id

  );

  localStorage.setItem(

    KEY,

    JSON.stringify(updated)

  );

}

export function isFavorite(id) {

  return getFavorites().includes(id);

}

export function clearFavorites() {

  localStorage.removeItem(KEY);

}