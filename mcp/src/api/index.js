// All requests go through Vite's /api proxy (target set via VITE_API_URL)
const BASE = '/api';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  return res.json();
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const dashboardApi = {
  /** All dashboard sections in one call */
  getAll: () => get('/dashboard'),

  getKpis:         () => get('/dashboard/kpis'),
  getSlaHotlist:   () => get('/dashboard/sla-hotlist'),
  getRuleChanges:  () => get('/dashboard/rule-changes'),
  getAutoReleases: () => get('/dashboard/auto-releases'),
};

// ── Work Queue ────────────────────────────────────────────────────────────────

export const workQueueApi = {
  /** { data: { new: [...], in_review: [...], ... } } */
  getAll: () => get('/work-queue'),

  /** { tab, data: [...] } */
  getByTab: (tab) => get(`/work-queue?tab=${encodeURIComponent(tab)}`),

  /** { data: { new: 0, in_review: 1, ... } } */
  getCounts: () => get('/work-queue/counts'),
};

// ── Cases ─────────────────────────────────────────────────────────────────────

export const casesApi = {
  /**
   * @param {{ search?, status?, priority?, sortBy?, sortDir? }} params
   */
  getAll: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ).toString();
    return get(`/cases${qs ? `?${qs}` : ''}`);
  },

  getById: (id) => get(`/cases/${id}`),

  getStatuses: () => get('/cases/statuses'),
};

// ── Held Orders ───────────────────────────────────────────────────────────────

export const heldOrdersApi = {
  /**
   * @param {{ sortBy?, sortDir? }} params
   */
  getAll: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ).toString();
    return get(`/held-orders${qs ? `?${qs}` : ''}`);
  },

  getById: (id) => get(`/held-orders/${id}`),
};

// ── Health ────────────────────────────────────────────────────────────────────

export const healthApi = {
  check: () => get('/health'),
};
