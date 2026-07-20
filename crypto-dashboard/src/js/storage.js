const FAVORITES = "cryptodash-favorites";

const THEME = "cryptodash-theme";

/* ---------------- Favorites ---------------- */

export function getFavorites() {

    return JSON.parse(

localStorage.getItem(FAVORITES)

    ) || [];

}

export function saveFavorite(id) {

    const favs = getFavorites();

    if (!favs.includes(id)) {

        favs.push(id);

    }

    localStorage.setItem(

FAVORITES,

JSON.stringify(favs)

    );

}

export function removeFavorite(id) {

    const favs = getFavorites()

        .filter(

coin => coin !== id

        );

    localStorage.setItem(

FAVORITES,

JSON.stringify(favs)

    );

}

export function isFavorite(id) {

    return getFavorites()

        .includes(id);

}

/* ---------------- Theme ---------------- */

export function saveTheme(theme) {

    localStorage.setItem(

THEME,

theme

    );

}

export function getTheme() {

    return (

localStorage.getItem(THEME)

|| "light"

    );

}

/* ---------------- Generic Cache ---------------- */

export function cacheData(key, value) {

    localStorage.setItem(

key,

JSON.stringify(value)

    );

}

export function getCache(key) {

    const data =

localStorage.getItem(key);

    if (!data) return null;

    return JSON.parse(data);

}

export function clearCache(key) {

    localStorage.removeItem(key);

}

export function clearAllCache() {

    localStorage.clear();

}