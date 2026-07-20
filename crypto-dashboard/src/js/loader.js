const loader = document.getElementById("loader");

/* ---------------- Show Loader ---------------- */

export function showLoader() {
  if (!loader) return;
  loader.classList.remove("hidden");
}

/* ---------------- Hide Loader ---------------- */

export function hideLoader() {
  if (!loader) return;
  loader.classList.add("hidden");
}

/* ---------------- Loading Wrapper ---------------- */

export async function withLoader(callback) {
  try {
    showLoader();
    return await callback();
  } finally {
    hideLoader();
  }
}