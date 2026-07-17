// src/lib/utils/popupFrequency.ts

/**
 * Key used in localStorage to store the timestamp (ms) when the popup was last shown.
 */
const STORAGE_KEY = 'corpicia_popup_last_shown';

/**
 * Returns true if the popup should be shown according to the configured frequency (in days).
 * If there is no previous record, returns true.
 */
export function shouldShowPopup(frequencyDays: number): boolean {
  if (frequencyDays <= 0) return true;
  const last = localStorage.getItem(STORAGE_KEY);
  if (!last) return true;
  const lastTs = Number(last);
  if (Number.isNaN(lastTs)) return true;
  const now = Date.now();
  const diffDays = (now - lastTs) / (1000 * 60 * 60 * 24);
  return diffDays >= frequencyDays;
}

/**
 * Record that the popup has just been shown.
 */
export function recordPopupShown(): void {
  localStorage.setItem(STORAGE_KEY, Date.now().toString());
}

/**
 * Clear the stored timestamp (useful for debugging).
 */
export function clearPopupRecord(): void {
  localStorage.removeItem(STORAGE_KEY);
}
