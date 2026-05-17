const KEY = 'mcp_recently_viewed';
const MAX = 6;

export function addRecentlyViewed(accountNo, customer) {
  const current = getRecentlyViewed();
  const deduped = current.filter(r => r.accountNo !== accountNo);
  const updated = [{ accountNo, customer }, ...deduped].slice(0, MAX);
  try { localStorage.setItem(KEY, JSON.stringify(updated)); } catch {}
}

export function getRecentlyViewed() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
