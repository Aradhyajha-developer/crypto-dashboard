const KEY = "favorites";

/*
================================
SAFE READ
================================
*/

function readStorage() {
  try {
    const data = localStorage.getItem(KEY);

    if (!data) return [];

    const parsed = JSON.parse(data);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Storage Read Error:", error);
    return [];
  }
}

/*
================================
SAFE WRITE
================================
*/

function writeStorage(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Storage Write Error:", error);
    return false;
  }
}

/*
================================
GET FAVORITES
================================
*/

export function getFavorites() {
  return readStorage();
}

/*
================================
SAVE FAVORITE
================================
*/

export function saveFavorite(id) {
  if (!id) return;

  const favorites = readStorage();

  if (!favorites.includes(id)) {
    favorites.push(id);
    writeStorage(favorites);
  }
}

/*
================================
REMOVE FAVORITE
================================
*/

export function removeFavorite(id) {
  if (!id) return;

  const favorites = readStorage().filter(
    coin => coin !== id
  );

  writeStorage(favorites);
}

/*
================================
TOGGLE FAVORITE
================================
*/

export function toggleFavorite(id) {
  if (!id) return false;

  if (isFavorite(id)) {
    removeFavorite(id);
    return false;
  }

  saveFavorite(id);
  return true;
}

/*
================================
CHECK FAVORITE
================================
*/

export function isFavorite(id) {
  return readStorage().includes(id);
}

/*
================================
CLEAR FAVORITES
================================
*/

export function clearFavorites() {
  writeStorage([]);
}

/*
================================
COUNT FAVORITES
================================
*/

export function favoriteCount() {
  return readStorage().length;
}

/*
================================
GET FAVORITES AS SET
================================
*/

export function getFavoriteSet() {
  return new Set(readStorage());
}

/*
================================
EXPORT FAVORITES
================================
*/

export function exportFavorites() {
  return JSON.stringify(readStorage(), null, 2);
}

/*
================================
IMPORT FAVORITES
================================
*/

export function importFavorites(json) {
  try {
    const data = JSON.parse(json);

    if (!Array.isArray(data)) {
      return false;
    }

    const unique = [...new Set(data)];

    writeStorage(unique);

    return true;
  } catch (error) {
    console.error("Import Error:", error);
    return false;
  }
}